import { SlashCommandBuilder, TextChannel } from 'discord.js';
import { botEnv } from '../config/botSettings';
import { matchMap, MatchState } from '../match';
import { getNowFlow, getNowTeam } from '../match/functions';
import { CommandFunction } from './types';
import { genCommandReplier } from './utils';

const commandName = 'match_laststep';

type Options_MatchLaststep = {};

const MatchLaststep: CommandFunction<Options_MatchLaststep> = async (interaction) => {
    const reply = genCommandReplier(interaction, commandName);
    if (!botEnv.hasAdminPermission(interaction.member)) return await reply.fail('並非主辦方，無法使用該指令');

    const { channel } = interaction;
    if (!(channel instanceof TextChannel)) return await reply.fail('指定頻道非純文字頻道');
    const match = matchMap.get(channel.id);
    if (!match) return await reply.fail('頻道非BP使用頻道');
    if (match.state != MatchState.running && match.state != MatchState.pause) return await reply.fail('頻道BP流程未處於運行中或是暫停狀態');
    if (match.flowIndex == 0) return await reply.fail('頻道BP流程已無法再往前回復了');

    match.state = MatchState.pause;
    match.timeStamp = Date.now();
    match.flowIndex--;
    match.isLastTeam = !match.isLastTeam;
    const nowTeam = getNowTeam(match);
    const { amount, option } = getNowFlow(match)!;
    const removed = nowTeam[option].slice(-amount);
    nowTeam[option] = nowTeam[option].slice(0, -amount);
    await reply.success(`已移除 ${nowTeam.teamRole.name} ${option} 的 \`${removed.join(' ')}\``, true, true);
};

export default {
    func: MatchLaststep,
    defs: new SlashCommandBuilder().setName(commandName).setDescription('[ 主辦方指令 ] 回復BP流程至上一個步驟'),
};
