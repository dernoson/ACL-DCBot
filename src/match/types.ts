import { Role, TextChannel } from 'discord.js';

export type Match = {
    channel: TextChannel;
    teams: [BP, BP];
    flow: Flow[];
    flowIndex: number;
    isLastTeam: boolean;
    state: MatchState;
    timeStamp: number;
};

export const enum MatchState {
    prepare = '準備中',
    running = '進行中',
    pause = '暫停',
    complete = '待確認',
    fixed = '已確認',
}

export type BP = {
    teamRole: Role;
    ban: string[];
    pick: string[];
};

export type BPOption = 'ban' | 'pick';

export type Flow<optionType = string> = {
    option: optionType;
    amount: number;
};
