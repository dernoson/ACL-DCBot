import { ChannelType, TextChannel } from 'discord.js';
import { clearMatchStorage, dumpMatchStorage, getMatchStorage, removeMatchStorage } from '../match';
import { createCommand } from '../commandUtils';
import { assertAdminPermission } from '../BotEnv';
import { commandSuccessResp } from '../functions';

export default createCommand('match_clear', '[ 主辦方指令 ] 清除BP流程')
    .option_Channel('channel', '選擇欲清除的BP使用頻道，未填選時，視為選擇使用該指令的當前頻道', false, [ChannelType.GuildText])
    .option_Boolean('all', '選填該選項為True時，無視channel指定，清空所有BP頻道指定')
    .callback((ctx, { channel, all }) => {
        assertAdminPermission(ctx);
        if (all) {
            const clearedChannel = clearMatchStorage();
            dumpMatchStorage();
            return commandSuccessResp(
                clearedChannel.length
                    ? `已清除以下頻道的BP流程：\n${clearedChannel.map((channel) => channel.name).join('\n')}`
                    : '未清除任何頻道的BP流程'
            );
        } else {
            const targetChannel = channel || ctx.channel;
            if (!(targetChannel instanceof TextChannel)) throw '無法找到頻道';
            const storage = getMatchStorage(targetChannel);
            if (!storage) throw '指定頻道非BP使用頻道';

            removeMatchStorage(targetChannel);
            dumpMatchStorage();
            return commandSuccessResp(`已清除 ${targetChannel.name} 的BP流程`);
        }
    });
