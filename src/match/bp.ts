import { GuildMember, Role, roleMention } from 'discord.js';
import { getAdminMention } from '../config/botSettings';
import { Match, MatchState, ModeSetting } from './match';
import { BPOption, StageSetting, calcFlowTotal, BPStageResult, isBPStageResult } from './types';

export const BP_logTotal = (flow: StageSetting<BPOption>[], match: Match) => {
    const limit = calcFlowTotal(flow);
    const banLimit = limit['ban'] / 2;
    const pickLimit = limit['pick'] / 2;
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
    if (team_1_Desp) result += `${result ? '\n' : ''}${match.teams[1].name}\`\`\`${team_1_Desp}\`\`\``;

    return result;
};

export const BP_onSelect = (flow: StageSetting<BPOption>[], match: Match, operatorList: string[], member: GuildMember) => {
    const stageSetting = flow[match.stageResult.length];
    const nowTeam = match.getNowTeam();

    if (member.roles.cache.every((role) => role.id != nowTeam.id)) throw '當前頻道內你並無使用/select指令的權限';
    if (operatorList.length != stageSetting.amount)
        throw `選擇幹員數量應為 ${stageSetting.amount} 位，你選擇了 ${operatorList.length} 位，請重新選擇`;

    const selected = match.stageResult.reduce<string[]>((prev, stageHeader) => {
        if (!isBPStageResult(stageHeader)) return [...prev];
        return [...prev, ...stageHeader.operators];
    }, []);
    if (operatorList.some((operator) => selected.includes(operator))) throw '部分選擇的幹員已被選擇過，請重新選擇';

    const selectResult = `${nowTeam.name} 選擇了 \`${operatorList.join(' ')}\`\n`;

    const stageResult: BPStageResult = { option: stageSetting.option, operators: operatorList };
    match.stageResult.push(stageResult);
    const stageLog = BP_logTotal(flow, match);

    const idx = match.stageResult.length;
    if (idx >= flow.length) match.state = MatchState.complete;

    const startStageResult = match.setStageStart();
    if (!startStageResult) return selectResult + '\n' + stageLog + '\n' + `流程已結束，請 ${getAdminMention()} 進行最後確認`;
    const timeLimitDesc = startStageResult.timeLimit ? `限時 ${startStageResult.timeLimit} 秒。` : '不限時間。';
    //TODO 決定下一步該用什麼解讀器
    return selectResult + '\n' + stageLog + '\n' + logStartBPStage(match.getNowTeam(), flow[idx]) + timeLimitDesc;
};

export const logStartBPStage = (team: Role, stage: StageSetting<BPOption>) => {
    return `請 ${roleMention(team.id)} 選擇要 ${stage.option} 的 ${stage.amount} 位幹員。`;
};

export const logRemoveBPStage = (team: Role, stage: BPStageResult) => {
    return `已移除 ${team.name} ${stage.option} 的 \`${stage.operators.join(' ')}\``;
};

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

export const createLogTotal_ModeBP = (flow: StageSetting<BPOption>[]): ModeSetting['logTotal'] => {
    return (...params) => BP_logTotal(flow, ...params);
};

export const createOnSelect_ModeBP = (flow: StageSetting<BPOption>[]): ModeSetting['onSelect'] => {
    return (...params) => BP_onSelect(flow, ...params);
};
