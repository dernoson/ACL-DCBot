import { ChannelType, TextChannel } from 'discord.js';
import { Match, matchMap, matchModeMap, MatchState } from '../match';
import { checkAdminPermission } from '../utils';
import { createCommand } from '../commandUtils';

export default createCommand('log_match', '[ 主辦方指令 ] 輸出BP流程情況')
    .option_Channel('channel', '選擇要輸出的BP使用頻道，未填選時，視為選擇使用該指令的當前頻道', false, [ChannelType.GuildText])
    .option_Boolean('all', '選填該選項為True時，無視channel指定，輸出所有BP頻道指定')
    .callback((ctx, { channel, all }) => {
        checkAdminPermission(ctx);
        if (all) {
            if (!matchMap.size) return { content: '目前無任何指定BP使用頻道', ephemeral: true };
            let content = '';
            matchMap.forEach((match) => (content += genMatchString(match)));
            return { content, ephemeral: true };
        } else {
            const targetChannel = channel || ctx.channel;
            if (!(targetChannel instanceof TextChannel)) throw '指定頻道非純文字頻道';
            const match = matchMap.get(targetChannel.id);
            if (!match) throw '頻道非BP使用頻道';

            return { content: genMatchString(match), ephemeral: true };
        }
    });

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
    [MatchState.confirm]: '已確認',
};
