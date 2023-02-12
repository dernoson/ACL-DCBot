import { Role, roleMention, TextChannel } from 'discord.js';
import { botEnv } from '../config/botSettings';
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

    const nowFlow = matchFlow.at(match.flowIndex);
    if (nowFlow) {
        const BPTimeLimit = botEnv.get('BPTimeLimit');
        const nextToDo = `${banDesc + pickDesc}\n請 ${roleMention(match.teams[+match.isLastTeam].teamRole.id)} 選擇要 \`${
            nowFlow.option
        }\` 的 \`${nowFlow.amount}\` 位幹員。`;
        return typeof BPTimeLimit == 'number' ? nextToDo + `限時${BPTimeLimit}秒。` : nextToDo;
    }
    return `${banDesc + pickDesc}\nBP流程已結束，請 ${botEnv.admin ? roleMention(botEnv.admin.id) : '伺服器管理員'} 進行最後確認`;
};

export const genMatch = (channel: TextChannel, teams: [Role, Role]): Match => ({
    channel,
    teams: [genBP(teams[0]), genBP(teams[1])],
    flowIndex: 0,
    isLastTeam: false,
    state: MatchState.prepare,
});

export const genBP = (teamRole: Role): BP => ({ teamRole, ban: [], pick: [] });

export const checkUnique = () => {};

export const getDuplicate = (operators: string[], { ban, pick }: BP) => {
    return operators.filter((name) => ban.includes(name) || pick.includes(name));
};

export const calcMatchFlow = <T extends Flow>(flow: T[], option: string) => {
    return flow.filter((stage) => option == stage.option).reduce((prev, { amount }) => prev + amount, 0) / 2;
};

export const getOperatorListDescription = (teamName: string, operatorList: string[], limit: number) => {
    return operatorList.length ? `${teamName} (${operatorList.length}/${limit})：\n\`\`\`${operatorList.join(' ')}\`\`\`` : '';
};
