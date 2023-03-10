import { GuildMember, SlashCommandBuilder } from 'discord.js';
import { matchMap, MatchState, matchModeMap } from '../match';
import { CommandFunction, OptionType } from '../types';
import { createNoRepeatArr } from '../utils';

type Options_Select = {
    operators: OptionType['String'];
};

const Select: CommandFunction<Options_Select> = (ctx, { operators }) => {
    const match = matchMap.get(ctx.channelId);
    if (!match) throw '該頻道目前未指定為BP頻道';
    if (match.state != MatchState.running) throw '當前頻道BP流程並非進行中';
    if (!(ctx.member instanceof GuildMember)) throw '使用者身分發生例外';

    const modeSetting = matchModeMap[match.matchMode];
    const operatorList = createNoRepeatArr(operators.trim().split(/\s+/));
    return modeSetting.onSelect(match, operatorList, ctx.member);
};

export default {
    func: Select,
    defs: new SlashCommandBuilder()
        .setName('select')
        .setDescription('[ 參賽者指令 ] 輸入我方所要選擇的幹員')
        .addStringOption((option) => option.setName('operators').setDescription('幹員全名，當多於一個幹員時，使用空白分隔').setRequired(true)),
};
