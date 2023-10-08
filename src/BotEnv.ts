import {
    BaseGuildTextChannel,
    ChatInputCommandInteraction,
    Client,
    Guild,
    GuildMember,
    PermissionFlagsBits,
    Role,
    roleMention,
    TextChannel,
    User,
} from 'discord.js';
import { readJson, writeJson } from './fileHandlers';

class BotEnv {
    private guild?: Guild;
    admin?: Role;
    logChannel?: BaseGuildTextChannel;

    async onBotReady(client: Client<true>) {
        this.guild = client.guilds.cache.first();
        botSettings = await readJson('config.json', () => ({}));
        this.admin = this.getRole('Admin');
        this.logChannel = this.getTextChannel('LogChannel');
        console.log('主辦方身分組指定:', this.admin?.name ?? '無');
        console.log('機器人log頻道指定:', this.logChannel?.name ?? '無');
    }

    async log(content: string) {
        if (this.logChannel) await this.logChannel.send(content);
        else console.log(content);
    }

    hasAdminPermission(member: ChatInputCommandInteraction['member']) {
        if (!(member instanceof GuildMember)) return false;
        if (this.admin) return member.roles.cache.some((role) => role.id == this.admin?.id);
        return member.permissions.has(PermissionFlagsBits.Administrator);
    }

    getRole(key: string) {
        const id = botSettings[key];
        if (this.guild && typeof id == 'string') return this.guild.roles.cache.get(id);
    }

    getTextChannel(key: string) {
        const id = botSettings[key];
        if (typeof id != 'string' || !this.guild) return;
        const channel = this.guild.channels.cache.get(id);
        if (channel instanceof TextChannel) return channel;
    }

    set(key: string, value: string | number | undefined) {
        botSettings[key] = value;
        writeJson(botSettings, 'config.json');
    }

    get(key: string) {
        return botSettings[key];
    }
}

export const getSetting = () => botSettings;

export const getAdminMention = () => (botEnv.admin ? roleMention(botEnv.admin.id) : '伺服器管理員');

export const logCommandResult = (commandName: string, option: 'success' | 'fail', username: string, content: string) => {
    botEnv.log(`> **[ ${commandName} ] ${option}**\n\`by ${username} at <${new Date()}>\`\n${content}`);
};

export const assertAdminPermission = (ctx: ChatInputCommandInteraction) => {
    if (!botEnv.hasAdminPermission(ctx.member)) throw '並非主辦方，無法使用該指令';
};

export const botEnv = new BotEnv();

let botSettings: Record<string, unknown>;
