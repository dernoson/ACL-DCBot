import { channelMention, ChannelType, PermissionFlagsBits, Role, roleMention, SlashCommandBuilder, TextChannel } from 'discord.js';
import { botEnv, dumpSetting } from '../config/botSettings';
import { CommandFunction, OptionType } from '../types';

type Options_SetEnv = {
    admin_role?: OptionType['Role'];
    log_channel?: OptionType['Channel'];
};

const SetEnv: CommandFunction<Options_SetEnv> = async (interaction, { admin_role, log_channel }) => {
    const admin = admin_role instanceof Role ? admin_role : undefined;
    const logChannel = log_channel instanceof TextChannel ? log_channel : undefined;
    botEnv.admin = admin;
    botEnv.logChannel = logChannel;
    botEnv.set('admin', admin);
    botEnv.set('logChannel', logChannel);

    dumpSetting();

    await interaction.reply(`\
[設定機器人環境] \n\
主辦方權限: ${botEnv.admin ? roleMention(botEnv.admin.id) : '伺服器管理者'}\n\
機器人log頻道: ${botEnv.logChannel ? channelMention(botEnv.logChannel.id) : '無'}\n\
    `);
};

export default {
    func: SetEnv,
    defs: new SlashCommandBuilder()
        .setName('set_env')
        .setDescription('設定主辦權限身分組，以及設定機器人log頻道')
        .addRoleOption((option) => option.setName('admin_role').setDescription('設定主辦權限身分組，當未設定時，主辦權限設為管理員權限'))
        .addChannelOption((option) =>
            option
                .setName('log_channel')
                .setDescription('設定機器人log頻道，當未設定時，僅將log導向server console log')
                .addChannelTypes(ChannelType.GuildText)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
};
