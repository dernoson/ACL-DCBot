import {
    BaseGuildTextChannel,
    channelMention,
    ChannelType,
    GuildMember,
    PermissionFlagsBits,
    Role,
    roleMention,
    SlashCommandBuilder,
    TextChannel,
} from 'discord.js';
import { botEnv, dumpSetting } from '../config/botSettings';
import type { CommandFunction, OptionType } from '../types';
import { checkSendMessagePermission } from '../utils';

type Options_SetEnv = {
    admin_role?: OptionType['Role'];
    log_channel?: OptionType['Channel'];
};

const SetEnv: CommandFunction<Options_SetEnv> = (ctx, { admin_role, log_channel }) => {
    const { member, user } = ctx;
    if (!(member instanceof GuildMember) || !member.permissions.has(PermissionFlagsBits.Administrator)) throw '並非管理員，無法使用該指令';

    const admin = admin_role instanceof Role ? admin_role : undefined;
    const logChannel = log_channel instanceof BaseGuildTextChannel ? log_channel : undefined;
    if (logChannel && (!ctx.guild || !checkSendMessagePermission(ctx.guild, logChannel)))
        throw '機器人在伺服器或指定頻道中並無發送訊息權限，請確認伺服器設定';
    botEnv.admin = admin;
    botEnv.logChannel = logChannel;
    botEnv.set('admin', admin);
    botEnv.set('logChannel', logChannel);

    dumpSetting();
    console.log(`[SetEnv by ${user.username}] admin: ${botEnv.admin?.name}, logChannel: ${botEnv.logChannel?.name}`);
    return {
        content: `
[設定機器人環境]
主辦方權限: ${botEnv.admin ? roleMention(botEnv.admin.id) : '伺服器管理員'}
機器人log頻道: ${botEnv.logChannel ? channelMention(botEnv.logChannel.id) : '無'}`,
        ephemeral: true,
    };
};

export default {
    func: SetEnv,
    defs: new SlashCommandBuilder()
        .setName('set_env')
        .setDescription('[ 管理員指令 ] 設定主辦權限身分組，以及設定機器人log頻道')
        .addRoleOption((option) => option.setName('admin_role').setDescription('設定主辦權限身分組，當未設定時，主辦權限設為管理員權限'))
        .addChannelOption((option) =>
            option
                .setName('log_channel')
                .setDescription('設定機器人log頻道，當未設定時，僅將log導向server console log')
                .addChannelTypes(ChannelType.GuildText)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
};
