import { Role, TextChannel } from 'discord.js';

// export class Match {
//     private channel: TextChannel;
//     private teams: [BP, BP];
//     private matchFlow: Flow[];
//     private flowIndex = 0;
//     private isLastTeam = true;

//     constructor(channel: TextChannel, teams: [Role, Role], matchFlow: Flow[]) {
//         this.channel = channel;
//         this.teams = [
//             { teamRole: teams[0], ban: [], pick: [] },
//             { teamRole: teams[1], ban: [], pick: [] },
//         ];
//         this.matchFlow = matchFlow;
//     }

//     getNowTeam() {
//         return this.teams[+this.isLastTeam];
//     }

//     nextStage() {
//         this.flowIndex++;
//         this.isLastTeam = !this.isLastTeam;
//     }

//     selectOperator(operators: string[], flow: Flow<BPOption>) {
//         const duplicateOperators = [...getDuplicate(operators, this.teams[0]), ...getDuplicate(operators, this.teams[1])];
//         if (duplicateOperators.length) return `選擇的幹員已被選擇過(${duplicateOperators.join(', ')})`;
//         if (operators.length != flow.amount) return `選擇幹員數量應為 ${flow.amount} 位，你選擇了 ${operators.length} 位，請重新選擇`;

//         const nowTeam = this.getNowTeam();
//         nowTeam[flow.option].concat(operators);

//         const banLimit = calcMatchFlow(this.matchFlow, 'ban');
//         const pickLimit = calcMatchFlow(this.matchFlow, 'pick');
//         const [teamA, teamB] = this.teams;

//         return `
// ${nowTeam.teamRole.name} 選擇了 \`${operators.join(' ')}\`\n
// 《當前Ban除幹員》\n
// ${getOperatorListDescription(teamA.teamRole.name, teamA.ban, banLimit)}
// ${getOperatorListDescription(teamB.teamRole.name, teamB.ban, banLimit)}
// 《當前Pick幹員》\n
// ${getOperatorListDescription(teamA.teamRole.name, teamA.pick, pickLimit)}
// ${getOperatorListDescription(teamB.teamRole.name, teamB.pick, pickLimit)}
// \n
// {self.next_stage()}`;
//     }
// }

export type Match = {
    channel: TextChannel;
    teams: [BP, BP];
    flowIndex: number;
    isLastTeam: boolean;
    state: MatchState;
};

export const enum MatchState {
    prepare,
    running,
    pause,
    complete,
    fixed,
}

export const genMatch = (channel: TextChannel, teams: [Role, Role]): Match => ({
    channel,
    teams: [genBP(teams[0]), genBP(teams[1])],
    flowIndex: 0,
    isLastTeam: false,
    state: MatchState.prepare,
});

export type BP = {
    teamRole: Role;
    ban: string[];
    pick: string[];
};

export const genBP = (teamRole: Role): BP => ({ teamRole, ban: [], pick: [] });

export const getDuplicate = (operators: string[], { ban, pick }: BP) => {
    return operators.filter((name) => ban.includes(name) || pick.includes(name));
};

export const getOperatorListDescription = (teamName: string, operatorList: string[], limit: number) => {
    return `${teamName} (${operatorList.length}/${limit})：\n\`\`\`${operatorList.join(' ')}\`\`\``;
};

type BPOption = 'ban' | 'pick';

type Flow<optionType = string> = {
    option: optionType;
    amount: number;
};

export const normalMatchFlow: Flow<BPOption>[] = [
    { option: 'ban', amount: 1 },
    { option: 'ban', amount: 1 },
    { option: 'ban', amount: 1 },
    { option: 'ban', amount: 1 },
    { option: 'ban', amount: 1 },
    { option: 'ban', amount: 1 },
    { option: 'pick', amount: 1 },
    { option: 'pick', amount: 2 },
    { option: 'pick', amount: 2 },
    { option: 'pick', amount: 2 },
    { option: 'pick', amount: 2 },
    { option: 'pick', amount: 2 },
    { option: 'pick', amount: 1 },
    { option: 'ban', amount: 1 },
    { option: 'ban', amount: 1 },
    { option: 'ban', amount: 1 },
    { option: 'ban', amount: 1 },
    { option: 'pick', amount: 1 },
    { option: 'pick', amount: 2 },
    { option: 'pick', amount: 2 },
    { option: 'pick', amount: 2 },
    { option: 'pick', amount: 2 },
    { option: 'pick', amount: 2 },
    { option: 'pick', amount: 1 },
];

export const calcMatchFlow = <T extends Flow>(flow: T[], option: string) => {
    return flow.filter((stage) => option == stage.option).reduce((prev, { amount }) => prev + amount, 0) / 2;
};

export const matchMap = new Map<string, Match>();
