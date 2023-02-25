import { ApplicationCommandOptionType, CacheType, ChatInputCommandInteraction, Client } from 'discord.js';
import { botEnv } from './config/botSettings';
import { normalMentionOptions } from './config/optionSettings';
import { CommandContext, OptionType } from './types';

export const getObjectKeys = <O extends {}>(obj: O) => Object.getOwnPropertyNames(obj) as (keyof O)[];

export const createMutualLock = () => {
    let locker: Promise<void> | undefined;
    return async () => {
        if (locker) await locker;
        let unlocker: () => void;
        locker = new Promise<void>((resolve) => (unlocker = resolve));
        return () => unlocker();
    };
};

export const createTimeoutHandler = (timeLimitMs: number, onTimeout: () => void): TimeoutHandler => {
    let isCanceled = false;
    setTimeout(() => !isCanceled && onTimeout(), timeLimitMs);
    return { cancel: () => (isCanceled = true) };
};

export type TimeoutHandler = {
    cancel: () => void;
};

export const getCommandOptions = (options: ChatInputCommandInteraction<CacheType>['options'], client: Client<true>) => {
    const channelCache = client.channels.cache;
    return options.data.reduce<Partial<{ [key: string]: OptionType[keyof OptionType] | null }>>((prev, { type, name, user, role, value }) => {
        switch (type) {
            case ApplicationCommandOptionType.Subcommand:
                return { ...prev, [name]: options.getSubcommand() };
            case ApplicationCommandOptionType.SubcommandGroup:
                return { ...prev, [name]: options.getSubcommandGroup() };
            case ApplicationCommandOptionType.User:
                return { ...prev, [name]: user };
            case ApplicationCommandOptionType.Channel: {
                const channel = options.getChannel(name);
                if (!channel) return prev;
                return { ...prev, [name]: channelCache.get(channel.id) };
            }
            case ApplicationCommandOptionType.Role:
                return { ...prev, [name]: role };
            case ApplicationCommandOptionType.Mentionable:
                return { ...prev, [name]: options.getMentionable(name) };
            case ApplicationCommandOptionType.Attachment:
                return { ...prev, [name]: options.getAttachment(name) };
            default:
                return { ...prev, [name]: value };
        }
    }, {});
};

const logCommandResult = async (commandName: string, option: 'success' | 'fail', username: string, content: string) => {
    await botEnv.log(`> **[ ${commandName} ] ${option}**\n\`by ${username} at <${new Date()}>\`\n${content}`);
};

export const createCommandContext = (interaction: ChatInputCommandInteraction<CacheType>, commandName: string): CommandContext => ({
    interaction,
    fail: async (content: string) => {
        await logCommandResult(commandName, 'fail', interaction.user.username, content);
        return { content, ephemeral: true };
    },
    success: async (content: string) => {
        await logCommandResult(commandName, 'success', interaction.user.username, content);
        return { content, ephemeral: true };
    },
});
