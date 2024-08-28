import {
    BaseGuildTextChannel,
    ChatInputCommandInteraction,
    Client,
    GuildBasedChannel,
    GuildMember,
    PermissionFlagsBits,
    Role,
    roleMention,
} from 'discord.js';
import { BotEnv, Config } from './types';
import { getConfigValue } from './functions';
import { createLogString } from '../utils';
import dayjs from 'dayjs';

export const initEnv = (client: Client<true>) => {
    env.guild = client.guilds.cache.first();
    env.admin = getConfigRole('Admin');
    const channel = getConfigChannel('LogChannel');
    if (channel instanceof BaseGuildTextChannel) env.logChannel = channel;
    console.log('主辦方身分組指定:', env.admin?.name ?? '無');
    console.log('機器人log頻道指定:', env.logChannel?.name ?? '無');
};

export const getEnv = () => Object.freeze({ ...env });

export const setEnv = (admin: Role | undefined, logChannel: BaseGuildTextChannel | undefined) => {
    env.admin = admin;
    env.logChannel = logChannel;
};

export const getConfigRole = <K extends keyof Config>(key: K): Config[K] extends string ? Role | undefined : undefined => {
    const value = getConfigValue(key);
    if (typeof value != 'string') return;
    if (!env.guild) return;
    return env.guild.roles.cache.get(value) as any;
};

export const getConfigChannel = <K extends keyof Config>(key: K): Config[K] extends string ? GuildBasedChannel | undefined : undefined => {
    const value = getConfigValue(key);
    if (typeof value != 'string') return;
    if (!env.guild) return;
    return env.guild.channels.cache.get(value) as any;
};

export const hasAdminPermission = (member: ChatInputCommandInteraction['member']) => {
    if (!(member instanceof GuildMember)) return false;
    if (env.admin) return member.roles.cache.has(env.admin.id);
    return member.permissions.has(PermissionFlagsBits.Administrator);
};

export const assertAdminPermission = (ctx: ChatInputCommandInteraction) => {
    if (!hasAdminPermission(ctx.member)) throw '並非主辦方，無法使用該指令';
};

export const getAdminMention = () => {
    return env.admin ? roleMention(env.admin.id) : '伺服器管理員';
};

export const log = async (content: string) => {
    if (env.logChannel) await env.logChannel.send(content);
    else console.log(content);
};

export const logCommandResult = (commandName: string, option: 'success' | 'fail', username: string, content: string) => {
    log(
        createLogString(
            `> **[ ${commandName} ] ${option}**`, //
            `\`by ${username} at ${dayjs().format('YYYY/MM/DD HH:mm:ss')}\``,
            content
        )
    );
};

const env: BotEnv = {};
