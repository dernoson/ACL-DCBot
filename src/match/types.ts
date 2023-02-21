import { Role, TextChannel } from 'discord.js';

export type MatchFlowSetting = {
    desc: string;
    flow: Flow[];
};

export const createMatchFlowMap = <M extends { [key: string]: MatchFlowSetting }>(map: M) => map;

export type Match = {
    channel: TextChannel;
    teams: [BP, BP];
    flowSetting: MatchFlowSetting;
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
