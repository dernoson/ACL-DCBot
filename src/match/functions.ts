import { Role, roleMention, TextChannel } from 'discord.js';
import { botEnv } from '../config/botSettings';
import { normalMentionOptions } from '../config/optionSettings';
import { getAdminMention } from '../utils';
import { BP, Flow, Match, MatchFlowSetting, MatchState } from './types';

export const setMatchStageNext = (match: Match) => getMatchStageDescription(match) + setStageToDo(match);

export const getMatchStageDescription = (match: Match) => {
    const [teamA, teamB] = match.teams;
    const banLimit = calcMatchFlow(match.flowSetting.flow, 'ban');
    const pickLimit = calcMatchFlow(match.flowSetting.flow, 'pick');

    const teamAban = teamA.ban.join(' ');
    const teamApick = teamA.pick;

    let banDesc =
        getOperatorListDescription(teamA.teamRole.name, teamA.ban, banLimit) +
        getOperatorListDescription(teamB.teamRole.name, teamB.ban, banLimit);
    banDesc && (banDesc = '《當前Ban除幹員》\n' + banDesc);

    let pickDesc =
        getOperatorListDescription(teamA.teamRole.name, teamA.pick, pickLimit) +
        getOperatorListDescription(teamB.teamRole.name, teamB.pick, pickLimit);
    pickDesc && (pickDesc = '《當前Pick幹員》\n' + pickDesc);

    return banDesc + pickDesc;
};

const setStageToDo = (match: Match) => {
    const nowFlow = getNowFlow(match);
    if (!nowFlow) {
        match.state = MatchState.complete;
        match.timeStamp = Date.now();
        return `BP流程已結束，請 ${getAdminMention()} 進行最後確認`;
    }
    const BPTimeLimit = botEnv.get('BPTimeLimit');

    const nextToDo = `請 ${roleMention(getNowTeam(match).teamRole.id)} 選擇要 \`${nowFlow.option}\` 的 \`${nowFlow.amount}\` 位幹員。`;
    if (typeof BPTimeLimit == 'number') {
        setBPTimeLimit(match, BPTimeLimit);
        return nextToDo + `限時 ${BPTimeLimit} 秒。`;
    }
    return nextToDo;
};

export const setBPTimeLimit = (match: Match, timeout: number) => {
    const timeStamp = Date.now();
    match.timeStamp = timeStamp;
    setTimeout(() => {
        if (match.timeStamp != timeStamp) return;
        match.state = MatchState.pause;
        match.channel.send({
            content: `選擇角色超時，已暫停BP流程，請 ${getAdminMention()} 進行處理中`,
            allowedMentions: normalMentionOptions,
        });
        botEnv.log(`> ${getNowTeam(match).teamRole.name} 於 ${match.channel.name} 選角超時。`);
    }, timeout * 1000);
};

export const createMatch = (channel: TextChannel, teams: [Role, Role], flowSetting: MatchFlowSetting): Match => ({
    channel,
    teams,
    flowSetting,
    flowIndex: 0,
    state: MatchState.prepare,
    timeStamp: Date.now(),
});

export const createBP = (): BP => ({ idx: 0, ban: [[], []], pick: [[], []] });

export const getUnique = (operators: string[]) => Array.from(new Set(operators));

export const getDuplicate = (operators: string[], { ban, pick }: BP) => {
    return operators.filter((name) => ban.includes(name) || pick.includes(name));
};

export const getNowTeam = (match: Match) => match.teams[+match.isLastTeam];

export const getNowFlow = (match: Match) => match.flowSetting.flow.at(match.flowIndex);

// export const getOperatorListDescription = (teamName: string, operatorList: string[], limit: number) => {
//     return operatorList.length ? `${teamName} (${operatorList.length}/${limit})：\n\`\`\`${operatorList.join(' ')}\`\`\`` : '';
// };
