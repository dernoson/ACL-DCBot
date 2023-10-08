import { BaseGuildTextChannel, channelMention, ChannelType, GuildMember, PermissionFlagsBits, Role, roleMention } from 'discord.js';
import { botEnv } from '../BotEnv';
import { createCommand } from '../commandUtils';
import { hasSendMessagePermission } from '../functions';
import { createLogString } from '../utils';

export default createCommand('set_env', '[ 管理員指令 ] 設定主辦權限身分組，以及設定機器人log頻道')
    .option_Role('admin_role', '設定主辦權限身分組，當未設定時，主辦權限設為管理員權限')
    .option_Channel('log_channel', '設定機器人log頻道，當未設定時，僅將log導向server console log', false, [ChannelType.GuildText])
    .permission(PermissionFlagsBits.Administrator)
    .callback((ctx, { admin_role, log_channel }) => {
        const { member, user } = ctx;
        if (!(member instanceof GuildMember) || !member.permissions.has(PermissionFlagsBits.Administrator)) throw '並非管理員，無法使用該指令';

        const admin = admin_role instanceof Role ? admin_role : undefined;
        const logChannel = log_channel instanceof BaseGuildTextChannel ? log_channel : undefined;
        if (logChannel && (!ctx.guild || !hasSendMessagePermission(ctx.guild, logChannel))) {
            throw '機器人在伺服器或指定頻道中並無發送訊息權限，請確認伺服器設定';
        }

        botEnv.admin = admin;
        botEnv.logChannel = logChannel;
        botEnv.set('Admin', admin?.id);
        botEnv.set('LogChannel', logChannel?.id);

        console.log(`[SetEnv by ${user.username}] admin: ${botEnv.admin?.name}, logChannel: ${botEnv.logChannel?.name}`);
        return {
            content: createLogString(
                '[設定機器人環境]',
                `主辦方權限: ${botEnv.admin ? roleMention(botEnv.admin.id) : '伺服器管理員'}`,
                `機器人log頻道: ${botEnv.logChannel ? channelMention(botEnv.logChannel.id) : '無'}`
            ),
            ephemeral: true,
        };
    });
