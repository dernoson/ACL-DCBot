import { getMatchStorage, matchModeDesc, MatchState, matchFlowMap } from '../match';
import { BotCommand, createLogString } from '../utils';
import { assertAdminPermission } from '../config';
import { roleMention, TextChannel } from 'discord.js';

export default new BotCommand('log_match', '[ 主辦方指令 ] 輸出該頻道的BP流程情況') //
    .callback((ctx) => {
        assertAdminPermission(ctx);

        const targetChannel = ctx.channel;
        if (!(targetChannel instanceof TextChannel)) throw '該頻道非純文字頻道';

        const storage = getMatchStorage(targetChannel);
        if (!storage) throw '該頻道非BP使用頻道';

        return {
            content: createLogString(
                `**===  ${roleMention(storage.teams[0].id)} vs ${roleMention(storage.teams[1].id)} ===**`,
                `狀態：${matchStateWording[storage.state]}`,
                `BP選角流程：${matchModeDesc[storage.matchMode]}`,
                matchFlowMap[storage.matchMode].logTotal(storage)
            ),
            ephemeral: true,
        };
    });

const matchStateWording: Record<MatchState, string> = {
    [MatchState.running]: '進行中',
    [MatchState.pause]: '暫停',
    [MatchState.complete]: '待確認',
};
