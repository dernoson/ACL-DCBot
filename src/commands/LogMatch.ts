import { ChannelType } from 'discord.js';
import { Match, matchMap, matchModeMap, MatchState } from '../match';
import { checkAdminPermission } from '../utils';
import { createCommand } from '../commandUtils';

export default createCommand('log_match', '[ 主辦方指令 ] 輸出BP流程情況')
    .option_Channel('channel', '選擇要輸出的BP使用頻道，未填選時，視為選擇使用該指令的當前頻道', false, [ChannelType.GuildText])
    .callback((ctx, { channel }) => {
        checkAdminPermission(ctx);
        const targetChannel = channel ?? ctx.channel;
        if (!targetChannel) throw '無法找到頻道';
        const match = matchMap.get(targetChannel.id);
        if (!match) throw '頻道非BP使用頻道';

        return { content: genMatchString(match), ephemeral: true };
    });

// TODO 應為match介面
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

const matchStateWording: Record<MatchState, string> = {
    [MatchState.prepare]: '準備中',
    [MatchState.running]: '進行中',
    [MatchState.pause]: '暫停',
    [MatchState.complete]: '待確認',
};
