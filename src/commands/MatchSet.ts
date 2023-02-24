import { ChannelType, Role, SlashCommandBuilder, TextChannel } from 'discord.js';
import { botEnv } from '../config/botSettings';
import { defaultMatchFlowSetting, genMatch, MatchFlowKey, matchFlowMap, matchMap } from '../match';
import { MatchFlowSetting } from '../match/types';
import type { CommandFunction, OptionType } from './types';
import { genCommandReplier } from './utils';

const commandName = 'match_set';

type Options_MatchSet = {
    channel: OptionType['Channel'];
    team1: OptionType['Role'];
    team2: OptionType['Role'];
    force?: OptionType['Boolean'];
};

const MatchSet: CommandFunction<Options_MatchSet> = async (interaction, { channel, team1, team2, force }) => {
    const reply = genCommandReplier(interaction, commandName);
    if (!botEnv.hasAdminPermission(interaction.member)) return await reply.fail('並非主辦方，無法使用該指令');
    if (!(channel instanceof TextChannel)) return await reply.fail('指定頻道非純文字頻道');
    if (!(team1 instanceof Role) || !(team2 instanceof Role)) return await reply.fail('指定身分組不符需求');
    if (!force && matchMap.has(channel.id))
        return await reply.fail('該頻道尚留存比賽分組指定，可使用match_clear指令先清除該頻道舊有指定，或是在該指令附加 { force: true } 選項');

    const flowSetting: MatchFlowSetting = matchFlowMap[botEnv.get('MatchFlow') as MatchFlowKey] || defaultMatchFlowSetting;
    matchMap.set(channel.id, genMatch(channel, [team1, team2], flowSetting));
    await reply.success(`指定比賽分組：${team1.name} vs ${team2.name} ， 指定BP頻道：${channel.name}\n${flowSetting.desc}`, true, true);
};

export default {
    func: MatchSet,
    defs: new SlashCommandBuilder()
        .setName(commandName)
        .setDescription('[ 主辦方指令 ] 設定比賽分組，並指定BP專用頻道')
        .addChannelOption((option) =>
            option.setName('channel').setDescription('BP使用頻道').addChannelTypes(ChannelType.GuildText).setRequired(true)
        )
        .addRoleOption((option) => option.setName('team1').setDescription('先手隊伍身分組').setRequired(true))
        .addRoleOption((option) => option.setName('team2').setDescription('後手隊伍身分組').setRequired(true))
        .addBooleanOption((option) => option.setName('force').setDescription('選填該選項為True時，強制覆蓋該頻道原有BP指定')),
};
