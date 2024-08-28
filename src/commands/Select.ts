import { BaseGuildTextChannel, GuildMember } from 'discord.js';
import { getMatchStorage, getMatchHandlers, MatchState } from '../match';
import { BotCommand } from '../utils';

export default new BotCommand('select', '[ 參賽者指令 ] 輸入我方所要選擇的幹員')
    .option_String('operators', '幹員全名，當多於一個幹員時，使用空白分隔', true)
    .callback((ctx, { operators }) => {
        const { channel, member } = ctx;
        if (!(channel instanceof BaseGuildTextChannel)) throw '無法在頻道使用該指令';

        const storage = getMatchStorage(channel);
        if (!storage) throw '該頻道目前未指定為BP頻道';

        if (!(member instanceof GuildMember)) throw '使用者身分發生例外';

        if (storage.state != MatchState.running) throw '當前頻道BP流程並非進行中';

        const modeSetting = getMatchHandlers(storage.matchMode);

        return modeSetting.onSelect(storage, [...new Set(operators.trim().split(/\s+/))], member);
    });
