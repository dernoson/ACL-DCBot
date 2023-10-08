import { TextChannel } from 'discord.js';
import { dumpMatchStorage, getMatchStorage, I_MatchHandlers, matchModeMap } from '../match';
import { createCommand } from '../commandUtils';
import { assertAdminPermission } from '../BotEnv';

export default createCommand('match_laststep', '[ 主辦方指令 ] 回復BP流程至上一個步驟') //
    .callback((ctx) => {
        assertAdminPermission(ctx);

        const { channel } = ctx;
        if (!(channel instanceof TextChannel)) throw '指定頻道非純文字頻道';
        const storage = getMatchStorage(channel);
        if (!storage) throw '頻道非BP使用頻道';
        const result = (matchModeMap[storage.matchMode] as I_MatchHandlers).onRemove(storage);
        dumpMatchStorage();
        return result;
    });
