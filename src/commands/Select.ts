import { GuildMember, SlashCommandBuilder } from 'discord.js';
import { BPOption, Flow, Match, getMatch, MatchState } from '../match';
import { getDuplicate, getNowFlow } from '../match/functions';
import { CommandFunction, CommandContext, OptionType, CommandResult } from '../types';
import { createNoRepeatArr } from '../utils';

type Options_Select = {
    operators: OptionType['String'];
};

const Select: CommandFunction<Options_Select> = (ctx, { operators }) => {
    const match = getMatch(ctx.channelId);
    if (!match) throw '該頻道目前未指定為BP頻道';

    const nowFlow = getNowFlow(match);
    if (match.state != MatchState.running || !nowFlow) throw '當前頻道BP流程並非進行中';

    const operatorList = createNoRepeatArr(operators.trim().split(/\s+/));
    if (nowFlow.option == 'ban' || nowFlow.option == 'pick') return banPickOperator(ctx, operatorList, match, nowFlow as Flow<BPOption>);
    else if (nowFlow.option == 'exchange') return exchangeOperator(ctx, operatorList, match, nowFlow as Flow<'exchange'>);
    else {
        throw `Unknown matchFlow option: ${nowFlow.option}`;
    }
    /////////////////////////////////////////////////////////////////

    const { member } = ctx;
    const nowTeamRoleId = getNowTeam(match).teamRole.id;
    if (!(member instanceof GuildMember) || member.roles.cache.every((role) => role.id != nowTeamRoleId))
        throw '當前頻道內你並無使用/select指令的權限';

    if (operatorList.length != nowFlow.amount) throw `選擇幹員數量應為 ${nowFlow.amount} 位，你選擇了 ${operatorList.length} 位，請重新選擇`;
};

const banPickOperator = (ctx: CommandContext, operatorList: string[], match: Match, nowFlow: Flow<BPOption>): CommandResult => {
    const duplicate = [...getDuplicate(operatorList, match.teams[0]), ...getDuplicate(operatorList, match.teams[1])];
    if (duplicate.length) throw `選擇的幹員已被選擇過(${duplicate.join(', ')})`;

    const nowTeam = getNowTeam(match);
    nowTeam[nowFlow.option].push(...operatorList);
    match.flowIndex++;
    match.isLastTeam = !match.isLastTeam;
    return `${nowTeam.teamRole.name} 選擇了 \`${operatorList.join(' ')}\`\n` + setMatchStageNext(match);
};

const exchangeOperator = (replier: CommandContext, operatorList: string[], match: Match, nowFlow: Flow<'exchange'>): CommandResult => {
    return {} as any;
};

export default {
    func: Select,
    defs: new SlashCommandBuilder()
        .setName('select')
        .setDescription('[ 參賽者指令 ] 輸入我方所要選擇的幹員')
        .addStringOption((option) => option.setName('operators').setDescription('幹員全名，當多於一個幹員時，使用空白分隔').setRequired(true)),
};
