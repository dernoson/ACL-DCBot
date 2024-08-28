import { TextChannel } from 'discord.js';
import { getMatchStorage, getMatchHandlers } from '../match';
import { assertAdminPermission } from '../config';
import { BotCommand } from '../utils';

export default new BotCommand('match_laststep', '[ 主辦方指令 ] 恢復該頻道的BP流程至上一個步驟') //
    .callback((ctx) => {
        assertAdminPermission(ctx);

        const { channel } = ctx;
        if (!(channel instanceof TextChannel)) throw '指定頻道非純文字頻道';

        const storage = getMatchStorage(channel);
        if (!storage) throw '頻道非BP使用頻道';

        return getMatchHandlers(storage.matchMode).onRemove(storage);
    });
