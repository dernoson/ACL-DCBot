import { SlashCommandBuilder, TextChannel, EmbedBuilder } from 'discord.js';
import { botEnv } from '../config/botSettings';
import { matchMap, MatchState } from '../match';
import { CommandFunction } from '../types';
import { logCommandResult, replyCommandFail } from '../utils';

const commandName = 'match_confirm';

type Options_MatchStart = {};

const MatchConfirm: CommandFunction<Options_MatchStart> = async (interaction) => {
    if (!botEnv.hasAdminPermission(interaction.member)) return await replyCommandFail(interaction, commandName, '並非主辦方，無法使用該指令');

    const { channel } = interaction;
    if (!(channel instanceof TextChannel)) return await replyCommandFail(interaction, commandName, '指定頻道非純文字頻道');
    const match = matchMap.get(channel.id);
    if (!match) return await replyCommandFail(interaction, commandName, '頻道非BP使用頻道');
    if (match.state != MatchState.complete) return await replyCommandFail(interaction, commandName, '頻道BP流程尚未處於可確認狀態');

    match.state = MatchState.fixed;
    const content = `已確認 ${match.channel.name} 的BP流程`;
    await interaction.reply(content);
    await logCommandResult(interaction.user.username, commandName, content);

    if (!botEnv.logChannel) return;
    const [teamA, teamB] = match.teams;
    const embed = new EmbedBuilder()
        .setTitle(`${teamA.teamRole.name} vs ${teamB.teamRole.name}`)
        .setAuthor({ name: interaction.user.username })
        .setDescription('BP流程確認')
        .addFields(
            {
                name: `${teamA.teamRole.name} Ban除幹員`,
                value: teamA.ban.join(' '),
            },
            {
                name: `${teamB.teamRole.name} Ban除幹員`,
                value: teamB.ban.join(' '),
            },
            {
                name: `${teamA.teamRole.name} Pick幹員`,
                value: teamA.pick.join(' '),
            },
            {
                name: `${teamB.teamRole.name} Pick幹員`,
                value: teamB.pick.join(' '),
            }
        )
        .setFooter({ text: `於 ${match.channel.name}` })
        .setTimestamp()
        .setColor('DarkAqua');

    await botEnv.logChannel.send({ embeds: [embed] });
};

export default {
    func: MatchConfirm,
    defs: new SlashCommandBuilder().setName(commandName).setDescription('[ 主辦方指令 ] 確認BP流程'),
};
