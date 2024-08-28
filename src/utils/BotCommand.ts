import {
    ApplicationCommandOptionAllowedChannelTypes,
    ApplicationCommandOptionType,
    Attachment,
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    User,
    CommandInteractionOption,
    InteractionReplyOptions,
} from 'discord.js';
import { normalMentionOptions } from '../consts';
import { logCommandResult } from '../config';

export class BotCommand<T extends Record<string, any> = {}> {
    protected builder: CommandBuilder;
    protected commandExecute: CommandExecute;

    constructor(name: string, description: string) {
        this.builder = new SlashCommandBuilder().setName(name).setDescription(description);
        this.commandExecute = () => Promise.resolve();
    }

    callback(fn: CommandFunction<T>): I_FixedBotCommand {
        this.commandExecute = async (ctx) => {
            const { options, commandName, user } = ctx;

            try {
                const result = fn(ctx, getCommandOptions(options) as T);
                const replyOption: Exclude<CommandResult, string> = typeof result == 'string' ? { content: result } : result;
                const { log } = replyOption;
                log && logCommandResult(commandName, 'success', user.username, log);
                await ctx.reply({ allowedMentions: normalMentionOptions, ...replyOption });
            } catch (error) {
                if (typeof error == 'string') {
                    logCommandResult(commandName, 'fail', user.username, error);
                    await ctx.reply({ content: '！！！指令失敗！！！\n' + error, ephemeral: true });
                } else {
                    await ctx.reply({ content: '擺爛啦！德諾索又要修機器人啦', ephemeral: true });
                    throw error;
                }
            }
        };
        return this;
    }

    permission(permissions: bigint) {
        this.builder = this.builder.setDefaultMemberPermissions(permissions);
        return this;
    }

    getExecute() {
        return this.commandExecute;
    }

    getBuilder() {
        return this.builder;
    }

    option_Boolean<K extends string>(name: K, description: string): BotCommand<T & Record<K, boolean | undefined>>;
    option_Boolean<K extends string, R extends boolean>(
        name: K,
        description: string,
        required: R
    ): BotCommand<T & Record<K, R extends true ? boolean : boolean | undefined>>;
    option_Boolean(name: string, description: string, required?: boolean) {
        this.builder = this.builder.addBooleanOption((op) => {
            return op
                .setName(name)
                .setDescription(description)
                .setRequired(required ?? false);
        });
        return this;
    }

    option_Number<K extends string>(name: K, description: string): BotCommand<T & Record<K, number | undefined>>;
    option_Number<K extends string, R extends boolean>(
        name: K,
        description: string,
        required: R
    ): BotCommand<T & Record<K, R extends true ? number : number | undefined>>;
    option_Number<K extends string, R extends boolean, C extends Record<number, string>>(
        name: K,
        description: string,
        required: R,
        choices: C
    ): BotCommand<T & Record<K, R extends true ? keyof C : keyof C | undefined>>;
    option_Number(name: string, description: string, required?: boolean, choices?: Record<number, string>) {
        this.builder = this.builder.addNumberOption((op) => {
            op = op
                .setName(name)
                .setDescription(description)
                .setRequired(required ?? false);
            if (choices) op = op.addChoices(...getObjectEntries(choices).map(([value, name]) => ({ name, value })));
            return op;
        });
        return this;
    }

    option_Integer<K extends string>(name: K, description: string): BotCommand<T & Record<K, number | undefined>>;
    option_Integer<K extends string, R extends boolean>(
        name: K,
        description: string,
        required: R
    ): BotCommand<T & Record<K, R extends true ? number : number | undefined>>;
    option_Integer<K extends string, R extends boolean, C extends Record<number, string>>(
        name: K,
        description: string,
        required: R,
        choices: C
    ): BotCommand<T & Record<K, R extends true ? keyof C : keyof C | undefined>>;
    option_Integer(name: string, description: string, required?: boolean, choices?: Record<number, string>) {
        this.builder = this.builder.addIntegerOption((op) => {
            op = op
                .setName(name)
                .setDescription(description)
                .setRequired(required ?? false);
            if (choices) op = op.addChoices(...getObjectEntries(choices).map(([value, name]) => ({ name, value })));
            return op;
        });
        return this;
    }

    option_String<K extends string>(name: K, description: string): BotCommand<T & Record<K, string | undefined>>;
    option_String<K extends string, R extends boolean>(
        name: K,
        description: string,
        required: R
    ): BotCommand<T & Record<K, R extends true ? string : string | undefined>>;
    option_String<K extends string, R extends boolean, C extends Record<string, string>>(
        name: K,
        description: string,
        required: R,
        choices: C
    ): BotCommand<T & Record<K, R extends true ? keyof C : keyof C | undefined>>;
    option_String(name: string, description: string, required?: boolean, choices?: Record<string, string>) {
        this.builder = this.builder.addStringOption((op) => {
            op = op
                .setName(name)
                .setDescription(description)
                .setRequired(required ?? false);
            if (choices) op = op.addChoices(...getObjectEntries(choices).map(([value, name]) => ({ name, value })));
            return op;
        });
        return this;
    }

    option_User<K extends string>(name: K, description: string): BotCommand<T & Record<K, User | undefined>>;
    option_User<K extends string, R extends boolean>(
        name: K,
        description: string,
        required: R
    ): BotCommand<T & Record<K, R extends true ? User : User | undefined>>;
    option_User(name: string, description: string, required?: boolean) {
        this.builder = this.builder.addUserOption((op) => {
            return op
                .setName(name)
                .setDescription(description)
                .setRequired(required ?? false);
        });
        return this;
    }

    option_Channel<K extends string>(name: K, description: string): BotCommand<T & Record<K, ChannelOptionType | undefined>>;
    option_Channel<K extends string, R extends boolean>(
        name: K,
        description: string,
        required: R
    ): BotCommand<T & Record<K, R extends true ? ChannelOptionType : ChannelOptionType | undefined>>;
    option_Channel<K extends string, R extends boolean, C extends ApplicationCommandOptionAllowedChannelTypes>(
        name: K,
        description: string,
        required: R,
        channelTypes: C[]
    ): BotCommand<T & Record<K, R extends true ? ChannelOptionType & { type: C } : (ChannelOptionType & { type: C }) | undefined>>;
    option_Channel(name: string, description: string, required?: boolean, channelTypes?: ApplicationCommandOptionAllowedChannelTypes[]) {
        this.builder = this.builder.addChannelOption((op) => {
            op = op
                .setName(name)
                .setDescription(description)
                .setRequired(required ?? false);
            if (channelTypes) op = op.addChannelTypes(...channelTypes);
            return op;
        });
        return this;
    }

    option_Role<K extends string>(name: K, description: string): BotCommand<T & Record<K, RoleOptionType | undefined>>;
    option_Role<K extends string, R extends boolean>(
        name: K,
        description: string,
        required: R
    ): BotCommand<T & Record<K, R extends true ? RoleOptionType : RoleOptionType | undefined>>;
    option_Role(name: string, description: string, required?: boolean) {
        this.builder = this.builder.addRoleOption((op) => {
            return op
                .setName(name)
                .setDescription(description)
                .setRequired(required ?? false);
        });
        return this;
    }

    option_Mentionable<K extends string>(name: K, description: string): BotCommand<T & Record<K, MentionableOptionType | undefined>>;
    option_Mentionable<K extends string, R extends boolean>(
        name: K,
        description: string,
        required: R
    ): BotCommand<T & Record<K, R extends true ? MentionableOptionType : MentionableOptionType | undefined>>;
    option_Mentionable(name: string, description: string, required?: boolean) {
        this.builder = this.builder.addMentionableOption((op) => {
            return op
                .setName(name)
                .setDescription(description)
                .setRequired(required ?? false);
        });
        return this;
    }

    option_Attachment<K extends string>(name: K, description: string): BotCommand<T & Record<K, Attachment | undefined>>;
    option_Attachment<K extends string, R extends boolean>(
        name: K,
        description: string,
        required: R
    ): BotCommand<T & Record<K, R extends true ? Attachment : Attachment | undefined>>;
    option_Attachment(name: string, description: string, required?: boolean) {
        this.builder = this.builder.addAttachmentOption((op) => {
            return op
                .setName(name)
                .setDescription(description)
                .setRequired(required ?? false);
        });
        return this;
    }
}

export const commandSuccessResp = (content: string): CommandResult => ({
    content,
    log: content,
    ephemeral: true,
});

const getObjectEntries = <O extends {}>(obj: O) => Object.entries(obj) as [keyof O, O[keyof O]][];

const getCommandOptions = (options: ChatInputCommandInteraction['options']) => {
    return options.data.reduce<Record<string, any>>((prev, optionValue) => {
        const { type, name } = optionValue;
        switch (type) {
            case ApplicationCommandOptionType.User:
                return { ...prev, [name]: options.getUser(name, true) };
            case ApplicationCommandOptionType.Channel:
                return { ...prev, [name]: options.getChannel(name, true) };
            case ApplicationCommandOptionType.Role:
                return { ...prev, [name]: options.getRole(name, true) };
            case ApplicationCommandOptionType.Mentionable:
                return { ...prev, [name]: options.getMentionable(name, true) };
            case ApplicationCommandOptionType.Attachment:
                return { ...prev, [name]: options.getAttachment(name, true) };
            default:
                return { ...prev, [name]: optionValue.value };
        }
    }, {});
};

export interface I_FixedBotCommand {
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

export type ChannelOptionType = NonNullable<CommandInteractionOption['channel']>;

export type RoleOptionType = NonNullable<CommandInteractionOption['role']>;

export type MentionableOptionType = NonNullable<CommandInteractionOption['member' | 'role' | 'user']>;
