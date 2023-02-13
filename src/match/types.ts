import { Role, TextChannel } from 'discord.js';

export type Match = {
    channel: TextChannel;
    teams: [BP, BP];
    flowIndex: number;
    isLastTeam: boolean;
    state: MatchState;
    timeStamp: number;
};

export const enum MatchState {
    prepare,
    running,
    pause,
    complete,
    fixed,
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
