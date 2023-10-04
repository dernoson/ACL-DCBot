import { ChatInputCommandInteraction, Guild, GuildTextBasedChannel, MessageMentionOptions, PermissionFlagsBits } from 'discord.js';
import { botEnv } from './BotEnv';
import { CommandResult } from './commandUtils';

export const getObjectKeys = <O extends {}>(obj: O) => Object.keys(obj) as (keyof O)[];

export const getObjectEntries = <O extends {}>(obj: O) => Object.entries(obj) as [keyof O, O[keyof O]][];

export const createNoRepeatArr = <T>(operators: T[]) => Array.from(new Set(operators));

export const createRestrictObj = <T>() => {
    return <O extends T>(obj: O) => obj;
};

export const createMutualLock = (): MutualLock => {
    let locker: Promise<void> | undefined;
    return async () => {
        if (locker) await locker;
        let unlocker: () => void;
        locker = new Promise<void>((resolve) => (unlocker = resolve));
        return () => unlocker?.();
    };
};

export type MutualLock = () => Promise<() => void>;

export const createTimeoutHandler = (timeLimitMs: number, onTimeout: () => void): TimeoutHandler => {
    let isCanceled = false;
    setTimeout(() => !isCanceled && onTimeout(), timeLimitMs);
    return { cancel: () => (isCanceled = true) };
};

export type TimeoutHandler = {
    cancel: () => void;
};

export const getRandomInt = (range?: number) => Math.floor(Math.random() * (range || 1));

//

export const logCommandResult = (commandName: string, option: 'success' | 'fail', username: string, content: string) => {
    botEnv.log(`> **[ ${commandName} ] ${option}**\n\`by ${username} at <${new Date()}>\`\n${content}`);
};

export const commandSuccessResp = (content: string): CommandResult => ({ content, log: content, ephemeral: true });

export const checkAdminPermission = (ctx: ChatInputCommandInteraction) => {
    if (!botEnv.hasAdminPermission(ctx.member)) throw '並非主辦方，無法使用該指令';
};

export const checkSendMessagePermission = (guild: Guild, channel: GuildTextBasedChannel) => {
    if (!guild.members.me?.permissions.has(PermissionFlagsBits.SendMessages)) return false;
    if (!guild.members.me?.permissionsIn(channel).has(PermissionFlagsBits.SendMessages)) return false;
    return true;
};

export const normalMentionOptions: MessageMentionOptions = { parse: ['roles', 'users'] };
