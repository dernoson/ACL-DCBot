import type { Awaitable, CacheType, ChatInputCommandInteraction, User, CommandInteractionOption, Channel } from 'discord.js';
import { CommandReplier } from './utils';

export type CommandFunction<O extends {} = any> = (interaction: ChatInputCommandInteraction<CacheType>, options: O) => Awaitable<void>;

export type OptionType = {
    Subcommand: string;
    SubcommandGroup: string;
    String: string;
    Integer: number;
    Boolean: boolean;
    User: User;
    Channel: Channel;
    Role: NonNullable<CommandInteractionOption<CacheType>['role']>;
    Mentionable: NonNullable<CommandInteractionOption<CacheType>['member' | 'role' | 'user']>;
    Number: number;
    Attachment: NonNullable<CommandInteractionOption<CacheType>['attachment']>;
};

export type ConfigOption = {
    desc: string;
    handler: (replier: CommandReplier, options: { value?: string }) => Awaitable<void>;
};
