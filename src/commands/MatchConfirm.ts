import { TextChannel, EmbedBuilder, roleMention } from 'discord.js';
import { dumpMatchStorage, getMatchStorage, getMatchHandlers, MatchState, removeMatchStorage } from '../match';
import { createCommand } from '../commandUtils';
import { createLogString } from '../utils';
import dayjs from 'dayjs';
import { assertAdminPermission, getEnv } from '../config';

export default createCommand('match_confirm', '[ 主辦方指令 ] 確認該頻道的BP流程') //
    .callback((ctx) => {
        assertAdminPermission(ctx);

        const { channel } = ctx;
        if (!(channel instanceof TextChannel)) throw '無法找到頻道';

        const storage = getMatchStorage(channel);
        if (!storage) throw '頻道非BP使用頻道';

        const { state, teams, matchMode } = storage;
        if (state != MatchState.complete) throw '頻道BP流程尚未處於可確認狀態';

        removeMatchStorage(channel);

        const env = getEnv();
        if (env.logChannel) {
            const embed = new EmbedBuilder()
                .setTitle(`${teams[0].name} vs ${teams[1].name}`)
                .setAuthor({ name: ctx.user.username })
                .setDescription('BP流程確認')
                .addFields({
                    name: '流程結果',
                    value: getMatchHandlers(matchMode).logTotal(storage),
                })
                .setFooter({ text: `於 ${channel.name}` })
                .setTimestamp()
                .setColor('DarkAqua');

            env.logChannel.send({ embeds: [embed] });
        }

        return createLogString(
            `已確認 ${channel.name} 的BP流程`, //
            `請 ${roleMention(teams[0].id)} 與 ${roleMention(teams[1].id)} 於以下時間點前繳交作戰紀錄：`,
            dayjs().add(1, 'day').format('YYYY/MM/DD HH:mm:ss')
        );
    });
