import { ChannelType, roleMention, SlashCommandBuilder, TextChannel } from 'discord.js';
import { botEnv } from '../config/botSettings';
import { CommandFunction, OptionType } from './types';
import { genCommandReplier } from './utils';
import { matchMap, MatchState, setMatchStageNext, Match } from '../match';
import { normalMentionOptions } from '../config/optionSettings';

const commandName = 'match_start';

type Options_MatchStart = {
    channel?: OptionType['Channel'];
    all?: OptionType['Boolean'];
};

const MatchStart: CommandFunction<Options_MatchStart> = async (interaction, { channel, all }) => {
    const reply = genCommandReplier(interaction, commandName);
    if (!botEnv.hasAdminPermission(interaction.member)) return await reply.fail('並非主辦方，無法使用該指令');

    if (all) {
        const startedMatchName: string[] = [];
        matchMap.forEach((match) => {
            const lastMatchState = match.state;
            if (lastMatchState != MatchState.prepare && lastMatchState != MatchState.pause) return;
            startedMatchName.push(match.channel.name);
            sendMatchStart(lastMatchState, match);
        });
        const content = startedMatchName.length ? `已啟動以下頻道的BP流程：\n${startedMatchName.join('\n')}` : '未啟動任何頻道的BP流程';
        await reply.success(content, true, true);
    } else {
        const targetChannel = channel || interaction.channel;
        if (!(targetChannel instanceof TextChannel)) return await reply.fail('指定頻道非純文字頻道');
        const match = matchMap.get(targetChannel.id);
        if (!match) return await reply.fail('指定頻道非BP使用頻道');
        const lastMatchState = match.state;
        if (lastMatchState != MatchState.prepare && lastMatchState != MatchState.pause) return await reply.fail('該頻道BP流程無法啟動');

        await sendMatchStart(lastMatchState, match);
        await reply.success(`已啟動 ${match.channel.name} 的BP流程`, true, true);
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
        .setName(commandName)
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
