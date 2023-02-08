import { channelMention, ChannelType, Role, roleMention, SlashCommandBuilder, TextChannel } from 'discord.js';
import { botEnv } from '../config/botSettings';
import { genMatch, matchMap } from '../config/match';
import type { CommandFunction, OptionType } from '../types';
import { logCommandResult, replyCommandError } from '../utils';

type Options_MatchSet = {
    channel: OptionType['Channel'];
    team1: OptionType['Role'];
    team2: OptionType['Role'];
    force?: OptionType['Boolean'];
};

const MatchSet: CommandFunction<Options_MatchSet> = async (interaction, { channel, team1, team2, force }) => {
    if (!botEnv.hasAdminPermission(interaction.member)) return await replyCommandError(interaction, 'match_set', '並非主辦方，無法使用該指令');
    if (!(channel instanceof TextChannel)) return await replyCommandError(interaction, 'match_set', '指定頻道非純文字頻道');
    if (!(team1 instanceof Role) || !(team2 instanceof Role)) return await replyCommandError(interaction, 'match_set', '指定身分組不符需求');
    if (!force && matchMap.has(channel.id))
        return await replyCommandError(
            interaction,
            'match_set',
            '該頻道尚留存比賽分組指定，可使用match_clear指令先清除該頻道舊有指定，或是在該指令附加 { force: true } 選項'
        );

    matchMap.set(channel.id, genMatch(channel, [team1, team2]));
    await interaction.reply({
        content: `指定比賽分組：${roleMention(team1.id)} vs ${roleMention(team2.id)} ， 指定BP頻道：${channelMention(channel.id)}`,
        ephemeral: true,
    });
    await logCommandResult(
        interaction.user.username,
        'match_set',
        `指定比賽分組：${team1.name} vs ${team2.name} ， 指定BP頻道：${channel.name}`
    );
};

export default {
    func: MatchSet,
    defs: new SlashCommandBuilder()
        .setName('match_set')
        .setDescription('[ 主辦方指令 ] 設定比賽分組，並指定BP專用頻道')
        .addChannelOption((option) =>
            option.setName('channel').setDescription('BP使用頻道').addChannelTypes(ChannelType.GuildText).setRequired(true)
        )
        .addRoleOption((option) => option.setName('team1').setDescription('先手隊伍身分組').setRequired(true))
        .addRoleOption((option) => option.setName('team2').setDescription('後手隊伍身分組').setRequired(true))
        .addBooleanOption((option) => option.setName('force').setDescription('是否強制覆蓋該頻道原有match指定')),
};
