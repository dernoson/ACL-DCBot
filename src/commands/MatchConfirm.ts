import { TextChannel, EmbedBuilder } from 'discord.js';
import { assertAdminPermission, botEnv } from '../BotEnv';
import { matchMap, matchModeMap, MatchState } from '../match';
import { createCommand } from '../commandUtils';

export default createCommand('match_confirm', '[ 主辦方指令 ] 確認BP流程') //
    .callback((ctx) => {
        assertAdminPermission(ctx);

        const { channel } = ctx;
        if (!(channel instanceof TextChannel)) throw '指定頻道非純文字頻道';
        const match = matchMap.get(channel.id);
        if (!match) throw '頻道非BP使用頻道';
        if (match.state != MatchState.complete) throw '頻道BP流程尚未處於可確認狀態';

        matchMap.delete(channel.id);
        const result = `已確認 ${match.channel.name} 的BP流程`;
        if (!botEnv.logChannel) return result;

        const [teamA, teamB] = match.teams;
        const embed = new EmbedBuilder()
            .setTitle(`${teamA.name} vs ${teamB.name}`)
            .setAuthor({ name: ctx.user.username })
            .setDescription('BP流程確認')
            .addFields({
                name: '流程結果',
                value: matchModeMap[match.matchMode].logTotal(match),
            })
            .setFooter({ text: `於 ${match.channel.name}` })
            .setTimestamp()
            .setColor('DarkAqua');

        botEnv.logChannel.send({ embeds: [embed] });
        return result;
    });
