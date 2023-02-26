import { ChannelType, SlashCommandBuilder, TextChannel } from 'discord.js';
import { matchMap } from '../match';
import { CommandFunction, OptionType } from '../types';
import { checkAdminPermission, commandSuccessResp } from '../utils';

type Options_MatchStart = {
    channel?: OptionType['Channel'];
    all?: OptionType['Boolean'];
};

const MatchClear: CommandFunction<Options_MatchStart> = (ctx, { channel, all }) => {
    checkAdminPermission(ctx);
    if (all) {
        const clearedMatchName: string[] = [];
        matchMap.forEach((match) => {
            clearedMatchName.push(match.channel.name);
            match.timeoutHandler?.cancel();
        });
        matchMap.clear();
        return commandSuccessResp(
            clearedMatchName.length ? `已清除以下頻道的BP流程：\n${clearedMatchName.join('\n')}` : '未清除任何頻道的BP流程'
        );
    } else {
        const targetChannel = channel || ctx.channel;
        if (!(targetChannel instanceof TextChannel)) throw '指定頻道非純文字頻道';
        const match = matchMap.get(targetChannel.id);
        if (!match) throw '指定頻道非BP使用頻道';

        matchMap.delete(targetChannel.id);
        match.timeoutHandler?.cancel();
        return commandSuccessResp(`已清除 ${match.channel.name} 的BP流程`);
    }
};

export default {
    func: MatchClear,
    defs: new SlashCommandBuilder()
        .setName('match_clear')
        .setDescription('[ 主辦方指令 ] 清除BP流程')
        .addChannelOption((option) =>
            option
                .setName('channel')
                .setDescription('選擇欲清除的BP使用頻道，未填選時，視為選擇使用該指令的當前頻道')
                .addChannelTypes(ChannelType.GuildText)
        )
        .addBooleanOption((option) => option.setName('all').setDescription('選填該選項為True時，無視channel指定，清空所有BP頻道指定')),
};
