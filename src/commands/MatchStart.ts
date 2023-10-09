import { TextChannel } from 'discord.js';
import { MatchState, getMatchHandlers, getMatchStorage } from '../match';
import { createCommand } from '../commandUtils';
import { assertAdminPermission } from '../config';

export default createCommand('match_start', '[ 主辦方指令 ] 啟動該頻道的BP流程') //
    .callback((ctx) => {
        assertAdminPermission(ctx);

        const targetChannel = ctx.channel;
        if (!(targetChannel instanceof TextChannel)) throw '該頻道非純文字頻道';

        const storage = getMatchStorage(targetChannel);
        if (!storage) throw '該頻道非BP使用頻道';

        if (storage.state == MatchState.running) throw '該頻道BP流程已為啟動狀態';
        if (storage.state == MatchState.complete) throw '該頻道BP流程已為待確認狀態';

        const matchHandlers = getMatchHandlers(storage.matchMode);
        const content = matchHandlers.onStart(storage);
        const log = `已啟動 ${targetChannel.name} 的BP流程`;
        if (typeof content == 'string') return { content, log };
        else return { ...content, log };
    });
