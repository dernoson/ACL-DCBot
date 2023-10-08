import { TextChannel, EmbedBuilder } from 'discord.js';
import { assertAdminPermission, botEnv } from '../BotEnv';
import { dumpMatchStorage, getMatchStorage, I_MatchHandlers, matchModeMap, MatchState, removeMatchStorage } from '../match';
import { createCommand } from '../commandUtils';

export default createCommand('match_confirm', '[ 主辦方指令 ] 確認BP流程') //
    .callback((ctx) => {
        assertAdminPermission(ctx);

        const { channel } = ctx;
        if (!(channel instanceof TextChannel)) throw '無法找到頻道';
        const storage = getMatchStorage(channel);
        if (!storage) throw '頻道非BP使用頻道';
        if (storage.state != MatchState.complete) throw '頻道BP流程尚未處於可確認狀態';

        removeMatchStorage(channel);

        if (botEnv.logChannel) {
            const { teams } = storage;
            const embed = new EmbedBuilder()
                .setTitle(`${teams[0].name} vs ${teams[1].name}`)
                .setAuthor({ name: ctx.user.username })
                .setDescription('BP流程確認')
                .addFields({
                    name: '流程結果',
                    value: (matchModeMap[storage.matchMode] as I_MatchHandlers).logTotal(storage),
                })
                .setFooter({ text: `於 ${channel.name}` })
                .setTimestamp()
                .setColor('DarkAqua');

            botEnv.logChannel.send({ embeds: [embed] });
        }

        dumpMatchStorage();

        return `已確認 ${channel.name} 的BP流程`;
    });
