import type { BaseGuildTextChannel, ChatInputCommandInteraction, Guild, Role } from 'discord.js';
import type { CommandResult } from '../commandUtils';
import type { MatchMode } from '../match';
import type { ResponsePluginKey } from '../responses';

export type Config = {
    Admin: string;
    LogChannel: string;
    BPTimePrepare: number;
    BPTimeLimit: number;
    BPTimeAlert: number;
    ResultSubmitLimit: number;
    MatchFlow: MatchMode;
    ResponsePlugin: ResponsePluginKey;
};

export type BotEnv = {
    guild?: Guild;
    admin?: Role;
    logChannel?: BaseGuildTextChannel;
};

export type ConfigOption = {
    desc: string;
    handler: (ctx: ChatInputCommandInteraction, value: string | undefined) => CommandResult;
};
