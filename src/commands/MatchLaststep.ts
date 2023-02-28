import { SlashCommandBuilder, TextChannel } from 'discord.js';
import { matchMap, MatchState } from '../match';
import { isBPStageResult, logRemoveBPStage } from '../match';
import { CommandFunction } from '../types';
import { checkAdminPermission, commandSuccessResp } from '../utils';

const MatchLaststep: CommandFunction = (ctx) => {
    checkAdminPermission(ctx);

    const { channel } = ctx;
    if (!(channel instanceof TextChannel)) throw '指定頻道非純文字頻道';
    const match = matchMap.get(channel.id);
    if (!match) throw '頻道非BP使用頻道';
    if (match.state != MatchState.running && match.state != MatchState.pause) throw '頻道BP流程未處於運行中或是暫停狀態';

    match.state = MatchState.pause;
    match.timeoutHandler?.cancel();
    const nowTeam = match.getNowTeam();
    const removedStage = match.stageResult.pop();
    if (!removedStage) throw '頻道BP流程已無法再往前回復了';

    if (isBPStageResult(removedStage)) return commandSuccessResp(logRemoveBPStage(nowTeam, removedStage));
    throw 'unknown StageResult';
};

export default {
    func: MatchLaststep,
    defs: new SlashCommandBuilder().setName('match_laststep').setDescription('[ 主辦方指令 ] 回復BP流程至上一個步驟'),
};
