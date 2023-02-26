import { SlashCommandBuilder, TextChannel } from 'discord.js';
import { matchMap, MatchState } from '../match';
import { getNowFlow, getNowTeam } from '../match/functions';
import { CommandFunction } from '../types';
import { checkAdminPermission, commandSuccessResp } from '../utils';

const MatchLaststep: CommandFunction = (ctx) => {
    checkAdminPermission(ctx);

    const { channel } = ctx;
    if (!(channel instanceof TextChannel)) throw '指定頻道非純文字頻道';
    const match = matchMap.get(channel.id);
    if (!match) throw '頻道非BP使用頻道';
    if (match.state != MatchState.running && match.state != MatchState.pause) throw '頻道BP流程未處於運行中或是暫停狀態';
    if (match.flowIndex == 0) throw '頻道BP流程已無法再往前回復了';

    match.state = MatchState.pause;
    match.timeStamp = Date.now();
    match.flowIndex--;
    match.isLastTeam = !match.isLastTeam;
    const nowTeam = getNowTeam(match);
    const { amount, option } = getNowFlow(match)!;
    const removed = nowTeam[option].slice(-amount);
    nowTeam[option] = nowTeam[option].slice(0, -amount);
    return commandSuccessResp(`已移除 ${nowTeam.teamRole.name} ${option} 的 \`${removed.join(' ')}\``);
};

export default {
    func: MatchLaststep,
    defs: new SlashCommandBuilder().setName('match_laststep').setDescription('[ 主辦方指令 ] 回復BP流程至上一個步驟'),
};
