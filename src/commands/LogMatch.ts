import { SlashCommandBuilder, TextChannel } from 'discord.js';
import { Match, matchMap, matchModeMap, MatchState } from '../match';
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
    const nowTeam = match.getNowTeam();
    const stageSetting = matchModeMap[match.matchMode].flow[match.stageResult.length];
    return `
**${match.channel.name}: ${teamA.name} vs ${teamB.name}**
狀態：${matchStateWording[match.state]} / ${stageSetting ? nowTeam.name + ' ' + stageSetting.option + ' ' + stageSetting.amount : '無'}
${matchModeMap[match.matchMode].logTotal(match)}
`;
};

const matchStateWording: { [key in MatchState]: string } = {
    [MatchState.prepare]: '準備中',
    [MatchState.running]: '進行中',
    [MatchState.pause]: '暫停',
    [MatchState.complete]: '待確認',
    [MatchState.confirm]: '已確認',
};

export default {
    func: LogMatch,
    defs: new SlashCommandBuilder()
        .setName('log_match')
        .setDescription('[ 主辦方指令 ] 輸出BP流程情況')
        .addChannelOption((option) => option.setName('channel').setDescription('選擇要輸出的BP使用頻道，未填選時，輸出所有BP使用頻道狀況')),
};
