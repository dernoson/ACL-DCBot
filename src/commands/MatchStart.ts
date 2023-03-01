import { ChannelType, roleMention, SlashCommandBuilder, TextChannel } from 'discord.js';
import { CommandFunction, OptionType } from '../types';
import { matchMap, MatchState, Match, matchModeMap, isBPStageSetting } from '../match';
import { checkAdminPermission, commandSuccessResp } from '../utils';

type Options_MatchStart = {
    channel?: OptionType['Channel'];
    all?: OptionType['Boolean'];
};

const MatchStart: CommandFunction<Options_MatchStart> = (ctx, { channel, all }) => {
    checkAdminPermission(ctx);
    if (all) {
        const startedMatchName: string[] = [];
        matchMap.forEach((match) => setMatchStart(match) && startedMatchName.push(match.channel.name));
        const result = startedMatchName.length ? `已啟動以下頻道的BP流程：\n${startedMatchName.join('\n')}` : '未啟動任何頻道的BP流程';
        return commandSuccessResp(result);
    } else {
        const targetChannel = channel || ctx.channel;
        if (!(targetChannel instanceof TextChannel)) throw '指定頻道非純文字頻道';
        const match = matchMap.get(targetChannel.id);
        if (!match) throw '指定頻道非BP使用頻道';
        if (!setMatchStart(match)) throw '該頻道BP流程無法啟動';
        return commandSuccessResp(`已啟動 ${match.channel.name} 的BP流程`);
    }
};

function setMatchStart(match: Match) {
    const lastState = match.state;
    const startStageResult = match.setStageStart();
    if (!startStageResult) return false;

    const modeSetting = matchModeMap[match.matchMode];
    const timeLimitDesc = startStageResult.timeLimit ? `限時 ${startStageResult.timeLimit} 秒。` : '不限時間。';
    const result = modeSetting.logTotal(match) + modeSetting.logStart(match) + timeLimitDesc;

    const versusDesc = `===  ${roleMention(match.teams[0].id)} vs ${roleMention(match.teams[1].id)} ===\n`;
    match.send(lastState == MatchState.prepare ? versusDesc + result : result);

    return true;
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
