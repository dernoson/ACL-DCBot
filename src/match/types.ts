import { Role, TextChannel } from 'discord.js';

export type Match = {
    channel: TextChannel;
    teams: [Role, Role];
    flowSetting: MatchFlowSetting;
    flowIndex: number;
    state: MatchState;
    timeStamp: number;
};

export type MatchFlowSetting<T extends string = string> = {
    desc: string;
    flow: Flow<T>[];
};

export type Flow<optionType = string> = {
    option: optionType;
    amount: number;
};

export type BPOption = 'ban' | 'pick';

export type BPEXOption = BPOption | 'exchange';

export const enum MatchState {
    prepare = '準備中',
    running = '進行中',
    pause = '暫停',
    complete = '待確認',
    fixed = '已確認',
}

export type BP = {
    idx: 0 | 1;
    ban: [string[], string[]];
    pick: [string[], string[]];
};
