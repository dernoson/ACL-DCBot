import { ChannelType, SlashCommandBuilder } from 'discord.js';
import { botEnv } from '../config/botSettings';
import type { CommandFunction, OptionType } from '../types';

type Options_Match = {
    channel: OptionType['Channel'];
    team1: OptionType['Role'];
    team2: OptionType['Role'];
};

const Match: CommandFunction<Options_Match> = async (interaction, { channel, team1, team2 }) => {
    if (!botEnv.hasAdminPermission(interaction.member)) {
        interaction.reply('fail');
    } else {
        interaction.reply('success');
    }
};

export default {
    func: Match,
    defs: new SlashCommandBuilder()
        .setName('match')
        .setDescription('[ 主辦方指令 ] 設定比賽分組，並指定BP專用頻道')
        .addChannelOption((option) =>
            option.setName('channel').setDescription('BP使用頻道').addChannelTypes(ChannelType.GuildText).setRequired(true)
        )
        .addRoleOption((option) => option.setName('team1').setDescription('先手隊伍身分組').setRequired(true))
        .addRoleOption((option) => option.setName('team2').setDescription('後手隊伍身分組').setRequired(true)),
};
