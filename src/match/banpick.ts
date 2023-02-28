import { roleMention } from 'discord.js';
import { botEnv } from '../config/botSettings';
import { StageHandler, Match, createMatchTimeout, MatchState } from './match';
import { calcFlowLimit } from './flowSettings';
import { StageHeader, BPOption } from './types';

export const BPStageHandler: StageHandler<BPOption> = {
    onStart(stage, match) {
        const BPTimeLimit = botEnv.get('BPTimeLimit');
        const teamRole = getNowTeam(match);
        const result = `請 ${roleMention(teamRole.id)} 選擇要 ${stage.option} 的 ${stage.amount} 位幹員。`;
        if (typeof BPTimeLimit == 'number') {
            createMatchTimeout(match, teamRole.name, BPTimeLimit);
            return result + `限時 ${BPTimeLimit} 秒。`;
        }
        return result;
    },
    onSelect(stage, operatorList, match, member) {
        const nowTeam = getNowTeam(match);
        if (member.roles.cache.every((role) => role.id != nowTeam.id)) throw '當前頻道內你並無使用/select指令的權限';
        if (operatorList.length != stage.amount) throw `選擇幹員數量應為 ${stage.amount} 位，你選擇了 ${operatorList.length} 位，請重新選擇`;

        const selected = match.stageResult.reduce<string[]>((prev, flowHeader) => {
            if (!isBPStageResult(flowHeader)) return [...prev];
            return [...prev, ...flowHeader.operators];
        }, []);
        if (operatorList.some((operator) => selected.includes(operator))) throw '部分選擇的幹員已被選擇過，請重新選擇';

        const stageResult: BPStageResult = {
            option: stage.option,
            operators: operatorList,
        };
        match.stageResult.push(stageResult);
        return `${nowTeam.name} 選擇了 \`${operatorList.join(' ')}\`\n`;
    },
    onRemove(match) {
        const teamRole = getNowTeam(match);
        const lastStage = match.stageResult.pop();
        if (!lastStage || !isBPStageResult(lastStage)) throw 'not BP Stage';
        return `已移除 ${teamRole.name} ${lastStage.option} 的 \`${lastStage.operators.join(' ')}\``;
    },
};

export type BPStageResult = StageHeader<BPOption> & {
    operators: string[];
};

export const isBPStageResult = (stage: StageHeader): stage is BPStageResult => stage.option == 'ban' || stage.option == 'pick';

export const logBPStage = (match: Match) => {
    const banLimit = calcFlowLimit(match.flowSettingKey, 'ban');
    const pickLimit = calcFlowLimit(match.flowSettingKey, 'pick');

    const bp = getBPList(match.stageResult);

    const getTeamBPDescription = (idx: 0 | 1) => {
        const ban = bp.ban[idx];
        const pick = bp.pick[idx];

        let result = '';
        if (ban.length) result += `=== ban (${ban.length}/${banLimit}) ===\n${ban.join(' ')}`;
        if (pick.length) result += `${result ? '\n\n' : ''}=== pick (${pick.length}/${pickLimit}) ===\n${pick.join(' ')}`;
        return result;
    };

    const team_0_Desp = getTeamBPDescription(0);
    const team_1_Desp = getTeamBPDescription(1);

    let result = '';
    if (team_0_Desp) result += `${match.teams[0].name}\`\`\`${team_0_Desp}\`\`\``;
    if (team_1_Desp) result += `${result ? '\n\n' : ''}${match.teams[1].name}\`\`\`${team_1_Desp}\`\`\``;

    return result;
};

export const getNowTeam = (match: Match) => match.teams[+(match.stageIndex % 2 != 0)];

const getBPList = (stageResult: Match['stageResult']) => {
    const bp = {
        ban: [[], []] as [string[], string[]],
        pick: [[], []] as [string[], string[]],
    };

    stageResult.forEach((flowHeader, index) => {
        if (!isBPStageResult(flowHeader)) return;
        bp[flowHeader.option][+(index % 2 != 0)].push(...flowHeader.operators);
    });

    return bp;
};
