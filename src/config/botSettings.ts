import {
    BaseGuildTextChannel,
    CacheType,
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
import settings from './botSettings.json' assert { type: 'json' };
import fs from 'fs';

const botSettings: { [key: string]: unknown } = settings;

class BotEnv {
    private guild?: Guild;
    admin?: Role;
    logChannel?: BaseGuildTextChannel;

    onBotReady(client: Client<true>) {
        this.guild = client.guilds.cache.first();
        if (!this.guild) throw 'Have no guild';
        this.admin = this.getRole('Admin');
        this.logChannel = this.getTextChannel('LogChannel');
        console.log('主辦方身分組指定: ', this.admin?.name);
        console.log('機器人log頻道指定: ', this.logChannel?.name);
    }

    async log(content: string) {
        if (this.logChannel) await this.logChannel.send(content);
        else console.log(content);
    }

    hasAdminPermission(member: ChatInputCommandInteraction<CacheType>['member']) {
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

    set(key: string, value: unknown) {
        if (value instanceof Role || value instanceof TextChannel || value instanceof User) settings[key] = value.id;
        else settings[key] = value;
    }

    get(key: string) {
        return botSettings[key];
    }
}

export const dumpSetting = () => {
    fs.writeFile('src/config/botSettings.json', JSON.stringify(botSettings, null, '\t'), (error) => error && console.log(error));
};

export const getSetting = () => botSettings;

export const getAdminMention = () => (botEnv.admin ? roleMention(botEnv.admin.id) : '伺服器管理員');

export const botEnv = new BotEnv();
