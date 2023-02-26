import { SlashCommandBuilder, TextChannel } from 'discord.js';
import { Match, matchMap } from '../match';
import { getMatchStageDescription, getNowFlow, getNowTeam } from '../match/functions';
import { CommandFunction, OptionType } from '../types';
import { checkAdminPermission } from '../utils';

type Options_LogMatch = {
    channel?: OptionType['Channel'];
};

const LogMatch: CommandFunction<Options_LogMatch> = (ctx, { channel }) => {
    checkAdminPermission(ctx);
    if (channel) {
        if (!(channel instanceof TextChannel)) throw '指定頻道非純文字頻道';
        const match = matchMap.get(channel.id);
        if (!match) throw '頻道非BP使用頻道';
        return { content: genMatchString(match), ephemeral: true };
    } else {
        if (!matchMap.size) return { content: '目前無任何指定BP使用頻道', ephemeral: true };
        let content = '';
        matchMap.forEach((match) => (content += genMatchString(match)));
        return { content, ephemeral: true };
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
        .setName('log_match')
        .setDescription('[ 主辦方指令 ] 輸出BP流程情況')
        .addChannelOption((option) => option.setName('channel').setDescription('選擇要輸出的BP使用頻道，未填選時，輸出所有BP使用頻道狀況')),
};
