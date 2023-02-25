import type {
    Awaitable,
    CacheType,
    Channel,
    ChatInputCommandInteraction,
    CommandInteractionOption,
    SlashCommandBuilder,
    User,
} from 'discord.js';

export type CommandExport = {
    func: CommandFunction;
    defs: Partial<SlashCommandBuilder>;
};

export type CommandFunction<O extends {} = any> = (replier: CommandReplier, options: O) => Awaitable<void>;

export type CommandReplier = {
    interaction: ChatInputCommandInteraction<CacheType>;
    fail: (content: string) => Promise<void>;
    success: (content: string) => Promise<void>;
    reply: (content: string, ephemeral?: boolean) => Promise<void>;
};

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
