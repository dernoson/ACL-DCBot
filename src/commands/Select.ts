import { CacheType, ChatInputCommandInteraction, GuildMember, SlashCommandBuilder } from 'discord.js';
import { normalMentionOptions } from '../config/optionSettings';
import { BPOption, Flow, Match, matchMap, MatchState } from '../match';
import { getDuplicate, getNowFlow, getNowTeam, setMatchStageNext, getUnique } from '../match/functions';
import { CommandFunction, OptionType } from './types';
import { genCommandReplier } from './utils';

const commandName = 'select';

type Options_Select = {
    operators: OptionType['String'];
};

const Select: CommandFunction<Options_Select> = async (interaction, { operators }) => {
    const reply = genCommandReplier(interaction, commandName);
    const match = matchMap.get(interaction.channelId);
    if (!match) return await reply.fail('該頻道目前未指定為BP頻道');

    const nowFlow = getNowFlow(match);
    if (match.state != MatchState.running || !nowFlow) return await reply.fail('當前頻道BP流程並非進行中');

    const { member } = interaction;
    const nowTeamRoleId = getNowTeam(match).teamRole.id;
    if (!(member instanceof GuildMember) || member.roles.cache.every((role) => role.id != nowTeamRoleId))
        return reply.fail('當前頻道內你並無使用/select指令的權限');

    const operatorList = getUnique(operators.trim().split(/\s+/));
    if (operatorList.length != nowFlow.amount)
        return await reply.fail(`選擇幹員數量應為 ${nowFlow.amount} 位，你選擇了 ${operatorList.length} 位，請重新選擇`);

    if (nowFlow.option == 'ban' || nowFlow.option == 'pick')
        return await banPickOperator(interaction, operatorList, match, nowFlow as Flow<BPOption>);
    else if (nowFlow.option == 'exchange') return await exchangeOperator(interaction, operatorList, match, nowFlow as Flow<'exchange'>);
    else return await reply.fail(`Unknown matchFlow option: ${nowFlow.option}`);
};

const banPickOperator = async (
    interaction: ChatInputCommandInteraction<CacheType>,
    operatorList: string[],
    match: Match,
    nowFlow: Flow<BPOption>
) => {
    const reply = genCommandReplier(interaction, commandName);
    const duplicate = [...getDuplicate(operatorList, match.teams[0]), ...getDuplicate(operatorList, match.teams[1])];
    if (duplicate.length) return await reply.fail(`選擇的幹員已被選擇過(${duplicate.join(', ')})`);

    const nowTeam = getNowTeam(match);
    nowTeam[nowFlow.option].push(...operatorList);
    match.flowIndex++;
    match.isLastTeam = !match.isLastTeam;
    await interaction.reply({
        content: `${nowTeam.teamRole.name} 選擇了 \`${operatorList.join(' ')}\`\n` + setMatchStageNext(match),
        allowedMentions: normalMentionOptions,
    });
};

const exchangeOperator = async (
    interaction: ChatInputCommandInteraction<CacheType>,
    operatorList: string[],
    match: Match,
    nowFlow: Flow<'exchange'>
) => {
    const reply = genCommandReplier(interaction, commandName);
};

const getExchangeTeamAspect = (member: ChatInputCommandInteraction<CacheType>['member'], match: Match) => {
    const firstTeam = match.teams[0];
};

export default {
    func: Select,
    defs: new SlashCommandBuilder()
        .setName(commandName)
        .setDescription('[ 參賽者指令 ] 輸入我方所要選擇的幹員')
        .addStringOption((option) => option.setName('operators').setDescription('幹員全名，當多於一個幹員時，使用空白分隔').setRequired(true)),
};
