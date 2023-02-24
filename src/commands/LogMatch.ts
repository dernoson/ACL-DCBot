import { SlashCommandBuilder, TextChannel } from 'discord.js';
import { botEnv } from '../config/botSettings';
import { Match, matchMap } from '../match';
import { getMatchStageDescription, getNowFlow, getNowTeam } from '../match/functions';
import { CommandFunction, OptionType } from './types';
import { genCommandReplier } from './utils';

const commandName = 'log_match';

type Options_LogMatch = {
    channel?: OptionType['Channel'];
};

const LogMatch: CommandFunction<Options_LogMatch> = async (interaction, { channel }) => {
    const reply = genCommandReplier(interaction, commandName);
    if (!botEnv.hasAdminPermission(interaction.member)) return await reply.fail('並非主辦方，無法使用該指令');
    if (channel) {
        if (!(channel instanceof TextChannel)) return await reply.fail('指定頻道非純文字頻道');
        const match = matchMap.get(channel.id);
        if (!match) return await reply.fail('頻道非BP使用頻道');
        interaction.reply({ content: genMatchString(match), ephemeral: true });
    } else {
        if (!matchMap.size) {
            interaction.reply({ content: '目前無任何指定BP使用頻道', ephemeral: true });
            return;
        }
        let content = '';
        matchMap.forEach((match) => (content += genMatchString(match)));
        interaction.reply({ content, ephemeral: true });
    }
};

const genMatchString = (match: Match) => {
    const [teamA, teamB] = match.teams;
    const nowTeam = getNowTeam(match);
    const nowFlow = getNowFlow(match);
    return `
**${match.channel.name}: ${teamA.teamRole.name} vs ${teamB.teamRole.name}**
狀態：${match.state} / ${nowFlow ? nowTeam.teamRole.name + ' ' + nowFlow.option + ' ' + nowFlow.amount : '無'}
${getMatchStageDescription(match)}
`;
};

export default {
    func: LogMatch,
    defs: new SlashCommandBuilder()
        .setName(commandName)
        .setDescription('[ 主辦方指令 ] 輸出BP流程情況')
        .addChannelOption((option) => option.setName('channel').setDescription('選擇要輸出的BP使用頻道，未填選時，輸出所有BP使用頻道狀況')),
};
