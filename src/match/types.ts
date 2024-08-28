import { BaseGuildTextChannel, GuildMember, Role } from 'discord.js';
import { CommandResult } from '../utils';

export interface I_MatchStorage<S extends StepHeader = StepHeader> {
    state: MatchState;
    readonly channel: BaseGuildTextChannel;
    readonly teams: [Role, Role];
    readonly matchMode: MatchMode;
    readonly stepStorage: S[];
    readonly restRoles: Record<string, string[]>;
}

export interface I_MatchHandlers<S extends StepHeader<string> = StepHeader<string>> {
    desc: string;
    flow: StepHeader[];
    logTotal: (storage: I_MatchStorage<S>) => string;
    onStart: (storage: I_MatchStorage<S>) => CommandResult;
    onRemove: (storage: I_MatchStorage<S>) => CommandResult;
    onSelect: (storage: I_MatchStorage<S>, operators: string[], member: GuildMember) => CommandResult;
}

export const enum MatchMode {
    normal,
    test,
    exchange,
    testExchange,
}

export const enum MatchState {
    running,
    pause,
    complete,
}

export type StepHeader<O extends string = string> = {
    option: O;
};
