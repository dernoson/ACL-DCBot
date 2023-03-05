import { ApplicationCommandOptionType, Client, Guild, GuildTextBasedChannel, PermissionFlagsBits } from 'discord.js';
import { botEnv } from './config/botSettings';
import { CommandContext, CommandResult, OptionType } from './types';

export const getObjectKeys = <O extends {}>(obj: O) => Object.getOwnPropertyNames(obj) as (keyof O)[];

export const createNoRepeatArr = <T>(operators: T[]) => Array.from(new Set(operators)) as T[];

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

export const createRestrictObj =
    <T>() =>
    <O extends T>(obj: O) =>
        obj;

export const getCommandOptions = (options: CommandContext['options'], client: Client<true>) => {
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

export const logCommandResult = (commandName: string, option: 'success' | 'fail', username: string, content: string) => {
    botEnv.log(`> **[ ${commandName} ] ${option}**\n\`by ${username} at <${new Date()}>\`\n${content}`);
};

export const commandSuccessResp = (content: string): CommandResult => ({ content, log: content, ephemeral: true });

export const checkAdminPermission = (ctx: CommandContext) => {
    if (!botEnv.hasAdminPermission(ctx.member)) throw '並非主辦方，無法使用該指令';
};

export const checkSendMessagePermission = (guild: Guild, channel: GuildTextBasedChannel) => {
    if (!guild.members.me?.permissions.has(PermissionFlagsBits.SendMessages)) return false;
    if (!guild.members.me?.permissionsIn(channel).has(PermissionFlagsBits.SendMessages)) return false;
    return true;
};
