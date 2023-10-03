import type {
    ApplicationCommandOptionAllowedChannelTypes,
    Attachment,
    ChatInputCommandInteraction,
    CommandInteractionOption,
    InteractionReplyOptions,
    SlashCommandBuilder,
    User,
} from 'discord.js';

export interface I_Command<T extends Record<string, any> = {}> {
    getBuilder(): CommandBuilder;
    callback(fn: CommandFunction<T>): I_FixedCommand;
    permission(permissions: bigint): I_Command<T>;
    option_Boolean<K extends string>(name: K, description: string): I_Command<T & Record<K, boolean | undefined>>;
    option_Boolean<K extends string, R extends boolean>(
        name: K,
        description: string,
        required: R
    ): I_Command<T & Record<K, R extends true ? boolean : boolean | undefined>>;
    option_Number<K extends string>(name: K, description: string): I_Command<T & Record<K, number | undefined>>;
    option_Number<K extends string, R extends boolean>(
        name: K,
        description: string,
        required: R
    ): I_Command<T & Record<K, R extends true ? number : number | undefined>>;
    option_Number<K extends string, R extends boolean, C extends Record<number, string>>(
        name: K,
        description: string,
        required: R,
        choices: C
    ): I_Command<T & Record<K, R extends true ? keyof C : keyof C | undefined>>;
    option_Integer<K extends string>(name: K, description: string): I_Command<T & Record<K, number | undefined>>;
    option_Integer<K extends string, R extends boolean>(
        name: K,
        description: string,
        required: R
    ): I_Command<T & Record<K, R extends true ? number : number | undefined>>;
    option_Integer<K extends string, R extends boolean, C extends Record<number, string>>(
        name: K,
        description: string,
        required: R,
        choices: C
    ): I_Command<T & Record<K, R extends true ? keyof C : keyof C | undefined>>;
    option_String<K extends string>(name: K, description: string): I_Command<T & Record<K, string | undefined>>;
    option_String<K extends string, R extends boolean>(
        name: K,
        description: string,
        required: R
    ): I_Command<T & Record<K, R extends true ? string : string | undefined>>;
    option_String<K extends string, R extends boolean, C extends Record<string, string>>(
        name: K,
        description: string,
        required: R,
        choices: C
    ): I_Command<T & Record<K, R extends true ? keyof C : keyof C | undefined>>;
    option_User<K extends string>(name: K, description: string): I_Command<T & Record<K, User | undefined>>;
    option_User<K extends string, R extends boolean>(
        name: K,
        description: string,
        required: R
    ): I_Command<T & Record<K, R extends true ? User : User | undefined>>;
    option_Channel<K extends string>(name: K, description: string): I_Command<T & Record<K, ChannelOptionType | undefined>>;
    option_Channel<K extends string, R extends boolean>(
        name: K,
        description: string,
        required: R
    ): I_Command<T & Record<K, R extends true ? ChannelOptionType : ChannelOptionType | undefined>>;
    option_Channel<K extends string, R extends boolean, C extends ApplicationCommandOptionAllowedChannelTypes>(
        name: K,
        description: string,
        required: R,
        channelTypes: C[]
    ): I_Command<T & Record<K, R extends true ? ChannelOptionType & { type: C } : (ChannelOptionType & { type: C }) | undefined>>;
    option_Role<K extends string>(name: K, description: string): I_Command<T & Record<K, RoleOptionType | undefined>>;
    option_Role<K extends string, R extends boolean>(
        name: K,
        description: string,
        required: R
    ): I_Command<T & Record<K, R extends true ? RoleOptionType : RoleOptionType | undefined>>;
    option_Mentionable<K extends string>(name: K, description: string): I_Command<T & Record<K, MentionableOptionType | undefined>>;
    option_Mentionable<K extends string, R extends boolean>(
        name: K,
        description: string,
        required: R
    ): I_Command<T & Record<K, R extends true ? MentionableOptionType : MentionableOptionType | undefined>>;
    option_Attachment<K extends string>(name: K, description: string): I_Command<T & Record<K, Attachment | undefined>>;
    option_Attachment<K extends string, R extends boolean>(
        name: K,
        description: string,
        required: R
    ): I_Command<T & Record<K, R extends true ? Attachment : Attachment | undefined>>;
}

export interface I_FixedCommand {
    getBuilder(): CommandBuilder;
    getExecute(): CommandExecute;
}

export type CommandBuilder = Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>;

export type CommandExecute = (ctx: ChatInputCommandInteraction) => Promise<void>;

export type CommandFunction<T = any> = (ctx: ChatInputCommandInteraction, options: T) => CommandResult;

export type CommandResult =
    | string
    | (InteractionReplyOptions & {
          log?: string;
      });

type ChannelOptionType = NonNullable<CommandInteractionOption['channel']>;

type RoleOptionType = NonNullable<CommandInteractionOption['role']>;

type MentionableOptionType = NonNullable<CommandInteractionOption['member' | 'role' | 'user']>;
