import { ChannelType, Role, SlashCommandBuilder, TextChannel } from 'discord.js';
import { botEnv } from '../config/botSettings';
import type { CommandFunction, OptionType } from '../types';
import { createMatch, matchMap, defaultFlowSettingKey, FlowSettingKey, getFlowDesc } from '../match';
import { checkAdminPermission, commandSuccessResp } from '../utils';

type Options_MatchSet = {
    channel: OptionType['Channel'];
    team1: OptionType['Role'];
    team2: OptionType['Role'];
    force?: OptionType['Boolean'];
};

const MatchSet: CommandFunction<Options_MatchSet> = (ctx, { channel, team1, team2, force }) => {
    checkAdminPermission(ctx);

    if (!(channel instanceof TextChannel)) throw '指定頻道非純文字頻道';
    if (!(team1 instanceof Role) || !(team2 instanceof Role)) throw '指定身分組不符需求';
    if (!force && matchMap.has(channel.id))
        throw '該頻道尚留存比賽分組指定，可使用match_clear指令先清除該頻道舊有指定，或是在該指令附加 { force: true } 選項';

    const flowSettingKey = (botEnv.get('MatchFlow') as FlowSettingKey) || defaultFlowSettingKey;
    matchMap.set(channel.id, createMatch(channel, [team1, team2], flowSettingKey));
    return commandSuccessResp(`指定比賽分組：${team1.name} vs ${team2.name} ， 指定BP頻道：${channel.name}\n${getFlowDesc(flowSettingKey)}`);
};

export default {
    func: MatchSet,
    defs: new SlashCommandBuilder()
        .setName('match_set')
        .setDescription('[ 主辦方指令 ] 設定比賽分組，並指定BP專用頻道')
        .addChannelOption((option) =>
            option.setName('channel').setDescription('BP使用頻道').addChannelTypes(ChannelType.GuildText).setRequired(true)
        )
        .addRoleOption((option) => option.setName('team1').setDescription('先手隊伍身分組').setRequired(true))
        .addRoleOption((option) => option.setName('team2').setDescription('後手隊伍身分組').setRequired(true))
        .addBooleanOption((option) => option.setName('force').setDescription('選填該選項為True時，強制覆蓋該頻道原有BP指定')),
};
