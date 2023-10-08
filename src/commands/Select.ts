import { BaseGuildTextChannel, GuildMember } from 'discord.js';
import { I_MatchHandlers, dumpMatchStorage, getMatchStorage, matchModeMap } from '../match';
import { createNoRepeatArr } from '../utils';
import { createCommand } from '../commandUtils';

export default createCommand('select', '[ 參賽者指令 ] 輸入我方所要選擇的幹員')
    .option_String('operators', '幹員全名，當多於一個幹員時，使用空白分隔', true)
    .callback((ctx, { operators }) => {
        const channel = ctx.channel;
        if (!(channel instanceof BaseGuildTextChannel)) throw '無法在頻道使用該指令';
        const storage = getMatchStorage(channel);
        if (!storage) throw '該頻道目前未指定為BP頻道';
        if (!(ctx.member instanceof GuildMember)) throw '使用者身分發生例外';

        const modeSetting = matchModeMap[storage.matchMode] as I_MatchHandlers;
        const operatorList = createNoRepeatArr(operators.trim().split(/\s+/));
        const result = modeSetting.onSelect(storage, operatorList, ctx.member);
        dumpMatchStorage();
        return result;
    });
