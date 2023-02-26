import { ChannelType, roleMention, SlashCommandBuilder, TextChannel } from 'discord.js';
import { CommandFunction, OptionType } from '../types';

import { normalMentionOptions } from '../config/optionSettings';

//TODO try
import { matchMap } from '../try/matchMap';
import { checkAdminPermission, commandSuccessResp } from '../utils';

type Options_MatchStart = {
    channel?: OptionType['Channel'];
    all?: OptionType['Boolean'];
};

const MatchStart: CommandFunction<Options_MatchStart> = (ctx, { channel, all }) => {
    checkAdminPermission(ctx);

    if (all) {
        const startedMatchName: string[] = [];
        matchMap.forEach((match) => {
            if (!match.setStart()) return;
            startedMatchName.push(match.channel.name);
        });

        return commandSuccessResp(
            startedMatchName.length ? `已啟動以下頻道的BP流程：\n${startedMatchName.join('\n')}` : '未啟動任何頻道的BP流程'
        );
    } else {
        const targetChannel = channel || ctx.channel;
        if (!(targetChannel instanceof TextChannel)) throw '指定頻道非純文字頻道';
        const match = matchMap.get(targetChannel.id);
        if (!match) throw '指定頻道非BP使用頻道';
        if (!match.setStart()) throw '該頻道BP流程無法啟動';
        return commandSuccessResp(`已啟動 ${match.channel.name} 的BP流程`);
    }
};

async function sendMatchStart(lastMatchState: MatchState, match: Match) {
    match.state = MatchState.running;
    const [teamA, teamB] = match.teams;
    const content =
        lastMatchState == MatchState.prepare
            ? `===  ${roleMention(teamA.teamRole.id)} vs ${roleMention(teamB.teamRole.id)} ===\n` + setMatchStageNext(match)
            : setMatchStageNext(match);

    await match.channel.send({ content, allowedMentions: normalMentionOptions });
}

export default {
    func: MatchStart,
    defs: new SlashCommandBuilder()
        .setName('match_start')
        .setDescription('[ 主辦方指令 ] 開始BP選角流程')
        .addChannelOption((option) =>
            option
                .setName('channel')
                .setDescription('選擇欲啟動的BP使用頻道，未填選時，視為選擇使用該指令的當前頻道')
                .addChannelTypes(ChannelType.GuildText)
        )
        .addBooleanOption((option) =>
            option.setName('all').setDescription('選填該選項為True時，無視channel指定，將所有狀態為未開始、暫停中的BP頻道設為開始狀態')
        ),
};
