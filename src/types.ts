import type { CacheType, Channel, ChatInputCommandInteraction, CommandInteractionOption, SlashCommandBuilder, User } from 'discord.js';

export type CommandExport = {
    func: CommandFunction<any>;
    defs: Partial<SlashCommandBuilder>;
};

export type CommandFunction<O extends {} = {}> = (ctx: CommandContext, options: O) => Promise<CommandResult>;

export type CommandResult =
    | string
    | {
          content: string;
          ephemeral?: boolean;
      };

export type CommandContext = {
    interaction: ChatInputCommandInteraction<CacheType>;
    fail: (content: string) => Promise<CommandResult>;
    success: (content: string) => Promise<CommandResult>;
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
