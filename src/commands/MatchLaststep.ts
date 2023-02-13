import { SlashCommandBuilder, TextChannel } from 'discord.js';
import { botEnv } from '../config/botSettings';
import { matchMap, MatchState, normalMatchFlow } from '../match';
import { getNowTeam } from '../match/functions';
import { CommandFunction } from '../types';
import { logCommandResult, replyCommandFail } from '../utils';

const commandName = 'match_laststep';

type Options_MatchLaststep = {};

const MatchLaststep: CommandFunction<Options_MatchLaststep> = async (interaction) => {
    if (!botEnv.hasAdminPermission(interaction.member)) return await replyCommandFail(interaction, commandName, '並非主辦方，無法使用該指令');

    const { channel } = interaction;
    if (!(channel instanceof TextChannel)) return await replyCommandFail(interaction, commandName, '指定頻道非純文字頻道');
    const match = matchMap.get(channel.id);
    if (!match) return await replyCommandFail(interaction, commandName, '頻道非BP使用頻道');
    if (match.state != MatchState.running && match.state != MatchState.pause)
        return await replyCommandFail(interaction, commandName, '頻道BP流程未處於運行中或是暫停狀態');
    if (match.flowIndex == 0) return await replyCommandFail(interaction, commandName, '頻道BP流程已無法再往前回復了');

    match.state = MatchState.pause;
    match.timeStamp = Date.now();
    match.flowIndex--;
    match.isLastTeam = !match.isLastTeam;
    const nowTeam = getNowTeam(match);
    const { amount, option } = normalMatchFlow[match.flowIndex];
    const removed = nowTeam[option].slice(-amount);
    nowTeam[option] = nowTeam[option].slice(0, -amount);
    const content = `已移除 ${nowTeam.teamRole.name} ${option} 的 \`${removed.join(' ')}\``;
    interaction.reply({ content, ephemeral: true });
    logCommandResult(interaction.user.username, commandName, content);
};

export default {
    func: MatchLaststep,
    defs: new SlashCommandBuilder().setName(commandName).setDescription('[ 主辦方指令 ] 回復BP流程至上一個步驟'),
};
