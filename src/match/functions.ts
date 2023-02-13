import { Role, roleMention, TextChannel } from 'discord.js';
import { botEnv } from '../config/botSettings';
import { normalMentionOptions } from '../config/optionSettings';
import { getAdminMention } from '../utils';
import { BP, Flow, Match, MatchState } from './types';

export const getMatchStageDescription = (match: Match, matchFlow: Flow[]) => {
    const [teamA, teamB] = match.teams;
    const banLimit = calcMatchFlow(matchFlow, 'ban');
    const pickLimit = calcMatchFlow(matchFlow, 'pick');

    let banDesc =
        getOperatorListDescription(teamA.teamRole.name, teamA.ban, banLimit) +
        getOperatorListDescription(teamB.teamRole.name, teamB.ban, banLimit);
    banDesc && (banDesc = '《當前Ban除幹員》\n' + banDesc);

    let pickDesc =
        getOperatorListDescription(teamA.teamRole.name, teamA.pick, pickLimit) +
        getOperatorListDescription(teamB.teamRole.name, teamB.pick, pickLimit);
    pickDesc && (pickDesc = '《當前Pick幹員》\n' + pickDesc);

    return banDesc + pickDesc + setStageToDo(match, matchFlow);
};

const setStageToDo = (match: Match, matchFlow: Flow[]) => {
    const nowFlow = matchFlow.at(match.flowIndex);
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

export const genMatch = (channel: TextChannel, teams: [Role, Role]): Match => ({
    channel,
    teams: [genBP(teams[0]), genBP(teams[1])],
    flowIndex: 0,
    isLastTeam: false,
    state: MatchState.prepare,
    timeStamp: Date.now(),
});

export const genBP = (teamRole: Role): BP => ({ teamRole, ban: [], pick: [] });

export const toUnique = (operators: string[]) => Array.from(new Set(operators));

export const getDuplicate = (operators: string[], { ban, pick }: BP) => {
    return operators.filter((name) => ban.includes(name) || pick.includes(name));
};

export const calcMatchFlow = <T extends Flow>(flow: T[], option: string) => {
    return flow.filter((stage) => option == stage.option).reduce((prev, { amount }) => prev + amount, 0) / 2;
};

export const getNowTeam = (match: Match) => match.teams[+match.isLastTeam];

export const getOperatorListDescription = (teamName: string, operatorList: string[], limit: number) => {
    return operatorList.length ? `${teamName} (${operatorList.length}/${limit})：\n\`\`\`${operatorList.join(' ')}\`\`\`` : '';
};
