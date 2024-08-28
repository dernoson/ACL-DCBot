import { TextChannel } from 'discord.js';
import { getMatchStorage, removeMatchStorage } from '../match';
import { createCommand, commandSuccessResp } from '../commandUtils';
import { assertAdminPermission } from '../config';

export default createCommand('match_clear', '[ 主辦方指令 ] 清除該頻道的BP流程') //
    .callback((ctx) => {
        assertAdminPermission(ctx);

        const { channel } = ctx;
        if (!(channel instanceof TextChannel)) throw '該頻道不是一般文字頻道';

        const storage = getMatchStorage(channel);
        if (!storage) throw '指定頻道非BP使用頻道';

        removeMatchStorage(channel);

        return commandSuccessResp(`已清除 ${channel.name} 的BP流程`);
    });
