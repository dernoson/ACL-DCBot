import { ChannelType, roleMention, TextChannel } from 'discord.js';
import { matchMap, MatchState, Match, matchModeMap } from '../match';
import { checkAdminPermission, commandSuccessResp, createTimeoutHandler } from '../utils';
import { createCommand } from '../commandUtils';

export default createCommand('match_start', '[ 主辦方指令 ] 開始BP選角流程')
    .option_Channel('channel', '選擇欲啟動的BP使用頻道，未填選時，視為選擇使用該指令的當前頻道', false, [ChannelType.GuildText])
    .option_Boolean('all', '選填該選項為True時，無視channel指定，將所有狀態為未開始、暫停中的BP頻道設為開始狀態')
    .option_Boolean('force', '選填該選項為True時，所有指定的頻道都會強制開始流程，不會等待')
    .callback((ctx, { channel, all, force }) => {
        checkAdminPermission(ctx);
        if (all) {
            const startedMatchName: string[] = [];
            matchMap.forEach((match) => setMatchStart(match, force) && startedMatchName.push(match.channel.name));
            const result = startedMatchName.length ? `已啟動以下頻道的BP流程：\n${startedMatchName.join('\n')}` : '未啟動任何頻道的BP流程';
            return commandSuccessResp(result);
        } else {
            const targetChannel = channel || ctx.channel;
            if (!(targetChannel instanceof TextChannel)) throw '指定頻道非純文字頻道';
            const match = matchMap.get(targetChannel.id);
            if (!match) throw '指定頻道非BP使用頻道';
            if (!setMatchStart(match, force)) throw '該頻道BP流程無法啟動';
            return commandSuccessResp(`已啟動 ${match.channel.name} 的BP流程`);
        }
    });

const setMatchStart = (match: Match, force?: boolean) => {
    const lastState = match.state;
    if (lastState != MatchState.prepare && lastState != MatchState.pause) return false;

    match.timeoutHandler?.cancel();
    const modeSetting = matchModeMap[match.matchMode];
    const result = modeSetting.logTotal(match) + modeSetting.onStart(match);

    const beforeStartDesc =
        `**===  ${roleMention(match.teams[0].id)} vs ${roleMention(match.teams[1].id)} ===**\n` +
        `此次使用的選角流程為 \`${modeSetting.desc}\`\n` +
        `途中遇到問題，都可以tag主辦方或管理員進行處理。\n\n`;

    if (lastState == MatchState.prepare && !force) {
        match.send(beforeStartDesc + '選角流程將於 3 分鐘後開始，請主辦方與參賽方做好準備。');
        match.timeoutHandler = createTimeoutHandler(180 * 1000, () => {
            match.send(result + match.setStart(modeSetting.flow));
        });
    } else if (lastState == MatchState.pause) {
        match.send(result + match.setStart(modeSetting.flow));
    } else if (lastState == MatchState.prepare) {
        match.send(beforeStartDesc + result + match.setStart(modeSetting.flow));
    }

    return true;
};
