import type {
    Awaitable,
    CacheType,
    ChatInputCommandInteraction,
    User,
    CommandInteractionOption,
    SlashCommandBuilder,
    Channel,
    ChannelType,
} from 'discord.js';

export type CommandFunction<O extends {} = any> = (interaction: ChatInputCommandInteraction<CacheType>, options: O) => Awaitable<void>;

export type CommandExport = {
    func: CommandFunction;
    defs: Partial<SlashCommandBuilder>;
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
