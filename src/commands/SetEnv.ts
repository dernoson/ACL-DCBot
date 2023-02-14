import { channelMention, ChannelType, GuildMember, PermissionFlagsBits, Role, roleMention, SlashCommandBuilder, TextChannel } from 'discord.js';
import { botEnv, dumpSetting } from '../config/botSettings';
import type { CommandFunction, OptionType } from '../types';
import { genCommandReplier } from '../utils';

const commandName = 'set_env';

type Options_SetEnv = {
    admin_role?: OptionType['Role'];
    log_channel?: OptionType['Channel'];
};

const SetEnv: CommandFunction<Options_SetEnv> = async (interaction, { admin_role, log_channel }) => {
    const reply = genCommandReplier(interaction, commandName);
    if (!(interaction.member instanceof GuildMember) || !interaction.member.permissions.has(PermissionFlagsBits.Administrator))
        return await reply.fail('並非管理員，無法使用該指令');

    const admin = admin_role instanceof Role ? admin_role : undefined;
    const logChannel = log_channel instanceof TextChannel ? log_channel : undefined;
    botEnv.admin = admin;
    botEnv.logChannel = logChannel;
    botEnv.set('admin', admin);
    botEnv.set('logChannel', logChannel);

    dumpSetting();

    await interaction.reply({
        content: `
[設定機器人環境]
主辦方權限: ${botEnv.admin ? roleMention(botEnv.admin.id) : '伺服器管理員'}
機器人log頻道: ${botEnv.logChannel ? channelMention(botEnv.logChannel.id) : '無'}`,
        ephemeral: true,
    });

    console.log(`[SetEnv by ${interaction.user.username}] admin: ${botEnv.admin?.name}, logChannel: ${botEnv.logChannel?.name}`);
};

export default {
    func: SetEnv,
    defs: new SlashCommandBuilder()
        .setName(commandName)
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
