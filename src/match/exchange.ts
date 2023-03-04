import { GuildMember } from 'discord.js';
import { getAdminMention } from '../config/botSettings';
import { CommandResult } from '../types';
import { BP_onStart, BP_onRemove, BP_onSelect } from './bp';
import { Match, ModeSetting } from './match';
import { BPEXOption, calcFlowTotal, StageSetting, isBPEXStageResult, BPEXStageResult, BPOption, isBPStageResult } from './types';

const exchangeRegMap = new Map<string, [string[], string[]]>();

export const BPEX_logTotal = (flow: StageSetting<BPEXOption>[], match: Match) => {
    const limit = calcFlowTotal(flow);
    const banLimit = limit['ban'] / 2;
    const pickLimit = limit['pick'] / 2;
    const exchangeLimit = limit['exchange'];
    const bpex = getBPEXList(match.stageResult);

    const getTeamBPEXDescription = (idx: 0 | 1) => {
        const ban = bpex.ban[idx];
        const pick = bpex.pick[idx];

        let result = '';
        if (ban.length) result += `=== ban (${ban.length}/${banLimit}) ===\n${ban.join(' ')}`;
        if (pick.length) result += `${result ? '\n\n' : ''}=== pick (${pick.length}/${pickLimit}) ===\n${pick.join(' ')}`;
        return result;
    };

    const team_0_Desp = getTeamBPEXDescription(0);
    const team_1_Desp = getTeamBPEXDescription(1);

    const teamAName = match.teams[0].name;
    const teamBName = match.teams[1].name;

    let result = '';
    if (team_0_Desp) result += `《${teamAName}》\`\`\`${team_0_Desp}\`\`\``;
    if (team_1_Desp) result += `${result ? '\n' : ''}《${teamBName}》\`\`\`${team_1_Desp}\`\`\``;
    if (bpex.exchange) {
        result += `${result ? '\n' : ''}交換幹員 (${bpex.exchange[0].length}/${exchangeLimit})`;
        result += `\`\`\`《${teamAName}》${bpex.exchange[1].join(' ')}\n⇅\n《${teamBName}》${bpex.exchange[0].join(' ')}\`\`\``;
    }
    return result;
};

export const BPEX_onStart = (flow: StageSetting<BPEXOption>[], match: Match) => {
    const idx = match.stageResult.length;
    const stageSetting = flow[idx];
    if (stageSetting.option == 'exchange') {
        exchangeRegMap.set(match.channel.id + '#' + idx, [[], []]);
        return `請雙方各自選擇要交換的 ${stageSetting.amount} 位幹員，該階段會在兩方都選擇完畢後，才會公布選擇內容。`;
    }
    return BP_onStart(flow as StageSetting<BPOption>[], match);
};

export const BPEX_onRemove = (match: Match) => {
    const idx = match.stageResult.length - 1;
    exchangeRegMap.delete(match.channel.id + '#' + idx);
    const removedStage = (match.stageResult as BPEXStageResult[])[idx];
    if (!removedStage) throw '頻道BP流程已無法再往前回復了';
    if (removedStage.option == 'exchange') {
        match.stageResult.pop();
        const teamAName = match.teams[0].name;
        const teamBName = match.teams[1].name;
        return (
            '已移除交換幹員：\n' +
            `《${teamAName}》${removedStage.operators[1].join(' ')}\n⇅\n《${teamBName}》${removedStage.operators[0].join(' ')}`
        );
    }
    return BP_onRemove(match);
};

export const BPEX_onSelect = (flow: StageSetting<BPEXOption>[], match: Match, operatorList: string[], member: GuildMember): CommandResult => {
    const stageSetting = flow[match.stageResult.length];
    const exchangeRegID = match.channel.id + '#' + match.stageResult.length;
    const nowTeam = match.getNowTeam();
    const { option } = stageSetting;
    const bpex = getBPEXList(match.stageResult);
    const exchangeReg = exchangeRegMap.get(exchangeRegID);

    if (option == 'exchange') {
        if (!exchangeReg) throw 'cannot find exchangeReg';
        const validTeamA = !exchangeReg[0].length && member.roles.cache.some((role) => role.id == match.teams[0].id);
        const validTeamB = !exchangeReg[1].length && member.roles.cache.some((role) => role.id == match.teams[1].id);
        if (!validTeamA && !validTeamB) throw '當前頻道內你並無使用/select指令的權限';
        if (operatorList.length != stageSetting.amount)
            throw `選擇幹員數量應為 ${stageSetting.amount} 位，你選擇了 ${operatorList.length} 位，請重新選擇`;
        if (validTeamA) {
            if (operatorList.some((op) => !bpex.pick[1].includes(op))) throw '部分選擇的幹員沒有在對方的pick列表，請重新選擇';
            exchangeReg[0].push(...operatorList);
        } else if (validTeamB) {
            if (operatorList.some((op) => !bpex.pick[0].includes(op))) throw '部分選擇的幹員沒有在對方的pick列表，請重新選擇';
            exchangeReg[1].push(...operatorList);
        }
        if (!exchangeReg[0].length || !exchangeReg[1].length) {
            return {
                content: `你已選擇交換 \`${operatorList.join(' ')}\`，等待對方完成選擇。\n你的選擇會在兩方都完成選擇後才會公布。`,
                ephemeral: true,
            };
        }

        const stageResult: BPEXStageResult = { option: 'exchange', operators: exchangeReg };
        match.stageResult.push(stageResult);
        exchangeRegMap.delete(exchangeRegID);
    } else {
        BP_onSelect(flow as StageSetting<BPOption>[], match, operatorList, member);
    }

    match.setPause();
    const selectResult = option == 'exchange' ? '' : `${nowTeam.name} 選擇了 \`${operatorList.join(' ')}\`\n`;
    const stageLog = BPEX_logTotal(flow, match);
    const timeLimitDesc = match.setStart(flow);
    if (!timeLimitDesc) return selectResult + '\n' + stageLog + '\n' + `流程已結束，請 ${getAdminMention()} 進行最後確認`;
    return selectResult + '\n' + stageLog + '\n' + BPEX_onStart(flow, match) + timeLimitDesc;
};

const getBPEXList = (stageResult: Match['stageResult']) => {
    const bpex = {
        ban: [[], []] as [string[], string[]],
        pick: [[], []] as [string[], string[]],
        exchange: undefined as [string[], string[]] | undefined,
    };

    const pick = [new Set<string>(), new Set<string>()];

    stageResult.forEach((flowHeader, index) => {
        if (!isBPEXStageResult(flowHeader)) return;
        if (flowHeader.option == 'ban') bpex.ban[+(index % 2 != 0)].push(...flowHeader.operators);
        else if (flowHeader.option == 'pick') flowHeader.operators.forEach((op) => pick[+(index % 2 != 0)].add(op));
        else if (flowHeader.option == 'exchange') {
            const exchange: [string[], string[]] = bpex.exchange ?? [[], []];
            exchange.forEach((arr, idx) => arr.push(...flowHeader.operators[idx]));
            bpex.exchange = exchange;
            flowHeader.operators[0].forEach((op) => {
                pick[0].add(op);
                pick[1].delete(op);
            });
            flowHeader.operators[1].forEach((op) => {
                pick[1].add(op);
                pick[0].delete(op);
            });
        }
    });

    pick.forEach((set, idx) => (bpex.pick[idx] = Array.from(set)));

    return bpex;
};

export const createLogTotal_ModeBPEX = (flow: StageSetting<BPEXOption>[]): ModeSetting['logTotal'] => {
    return (...params) => BPEX_logTotal(flow, ...params);
};

export const createOnStart_ModeBPEX = (flow: StageSetting<BPEXOption>[]): ModeSetting['onStart'] => {
    return (...params) => BPEX_onStart(flow, ...params);
};

export const createOnSelect_ModeBPEX = (flow: StageSetting<BPEXOption>[]): ModeSetting['onSelect'] => {
    return (...params) => BPEX_onSelect(flow, ...params);
};
