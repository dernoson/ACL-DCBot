import { BaseGuildTextChannel, ChannelType } from 'discord.js';
import { getMatchStorage, I_MatchHandlers, I_MatchStorage, matchModeMap, MatchState } from '../match';
import { createCommand } from '../commandUtils';
import { assertAdminPermission } from '../BotEnv';
import { createLogString } from '../utils';

export default createCommand('log_match', '[ 主辦方指令 ] 輸出BP流程情況')
    .option_Channel('channel', '選擇要輸出的BP使用頻道，未填選時，視為選擇使用該指令的當前頻道', false, [ChannelType.GuildText])
    .callback((ctx, { channel }) => {
        assertAdminPermission(ctx);
        const targetChannel = channel ?? ctx.channel;
        if (!(targetChannel instanceof BaseGuildTextChannel)) throw '無法找到頻道';

        const storage = getMatchStorage(targetChannel);
        if (!storage) throw '頻道非BP使用頻道';

        return { content: genMatchString(storage), ephemeral: true };
    });

const genMatchString = (storage: I_MatchStorage) => {
    const [teamA, teamB] = storage.teams;
    const matchHandlers = matchModeMap[storage.matchMode] as I_MatchHandlers;
    return createLogString(
        `**${storage.channel.name}: ${teamA.name} vs ${teamB.name}**`, //
        `狀態：${matchStateWording[storage.state]}`,
        matchHandlers.logTotal(storage)
    );
};

const matchStateWording: Record<MatchState, string> = {
    [MatchState.running]: '進行中',
    [MatchState.pause]: '暫停',
    [MatchState.complete]: '待確認',
};
