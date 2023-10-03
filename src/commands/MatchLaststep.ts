import { TextChannel } from 'discord.js';
import { matchMap, matchModeMap, MatchState } from '../match';
import { checkAdminPermission } from '../utils';
import { createCommand } from '../commandUtils';

export default createCommand('match_laststep', '[ 主辦方指令 ] 回復BP流程至上一個步驟') //
    .callback((ctx) => {
        checkAdminPermission(ctx);

        const { channel } = ctx;
        if (!(channel instanceof TextChannel)) throw '指定頻道非純文字頻道';
        const match = matchMap.get(channel.id);
        if (!match) throw '頻道非BP使用頻道';
        if (match.state == MatchState.prepare || match.state == MatchState.confirm) throw '頻道BP流程未處於可後退狀態';

        match.setPause();
        const content = matchModeMap[match.matchMode].onRemove(match);

        return { content, log: content };
    });
