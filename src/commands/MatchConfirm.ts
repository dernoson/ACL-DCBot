import { SlashCommandBuilder, TextChannel, EmbedBuilder } from 'discord.js';
import { botEnv } from '../config/botSettings';
import { matchMap, MatchState } from '../match';
import { CommandFunction } from '../types';
import { checkAdminPermission, commandSuccessResp } from '../utils';

const MatchConfirm: CommandFunction = (ctx) => {
    checkAdminPermission(ctx);

    const { channel } = ctx;
    if (!(channel instanceof TextChannel)) throw '指定頻道非純文字頻道';
    const match = matchMap.get(channel.id);
    if (!match) throw '頻道非BP使用頻道';
    if (match.state != MatchState.complete) throw '頻道BP流程尚未處於可確認狀態';

    match.state = MatchState.fixed;
    const result = commandSuccessResp(`已確認 ${match.channel.name} 的BP流程`);
    if (!botEnv.logChannel) return result;

    const [teamA, teamB] = match.teams;
    const embed = new EmbedBuilder()
        .setTitle(`${teamA.teamRole.name} vs ${teamB.teamRole.name}`)
        .setAuthor({ name: ctx.user.username })
        .setDescription('BP流程確認')
        .addFields(
            {
                name: `${teamA.teamRole.name} Ban除幹員`,
                value: '```' + teamA.ban.join(' ') + '```',
            },
            {
                name: `${teamB.teamRole.name} Ban除幹員`,
                value: '```' + teamB.ban.join(' ') + '```',
            },
            {
                name: `${teamA.teamRole.name} Pick幹員`,
                value: '```' + teamA.pick.join(' ') + '```',
            },
            {
                name: `${teamB.teamRole.name} Pick幹員`,
                value: '```' + teamB.pick.join(' ') + '```',
            }
        )
        .setFooter({ text: `於 ${match.channel.name}` })
        .setTimestamp()
        .setColor('DarkAqua');

    botEnv.logChannel.send({ embeds: [embed] });
    return result;
};

export default {
    func: MatchConfirm,
    defs: new SlashCommandBuilder().setName('match_confirm').setDescription('[ 主辦方指令 ] 確認BP流程'),
};
