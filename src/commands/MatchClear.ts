import { ChannelType, SlashCommandBuilder, TextChannel } from 'discord.js';
import { botEnv } from '../config/botSettings';
import { matchMap } from '../match';
import { CommandFunction, OptionType } from '../types';
import { logCommandResult, replyCommandFail } from '../utils';

const commandName = 'match_clear';

type Options_MatchStart = {
    channel?: OptionType['Channel'];
    all?: OptionType['Boolean'];
};

const MatchClear: CommandFunction<Options_MatchStart> = async (interaction, { channel, all }) => {
    if (!botEnv.hasAdminPermission(interaction.member)) return await replyCommandFail(interaction, commandName, '並非主辦方，無法使用該指令');
    if (all) {
        const clearedMatchName: string[] = [];
        matchMap.forEach((match) => {
            clearedMatchName.push(match.channel.name);
            match.timeStamp = Date.now();
        });
        matchMap.clear();
        const content = clearedMatchName.length ? `已清除以下頻道的BP流程：\n${clearedMatchName.join('\n')}` : '未清除任何頻道的BP流程';
        await interaction.reply({ content, ephemeral: true });
        await logCommandResult(interaction.user.username, commandName, content);
    } else {
        const targetChannel = channel || interaction.channel;
        if (!(targetChannel instanceof TextChannel)) return await replyCommandFail(interaction, commandName, '指定頻道非純文字頻道');
        const match = matchMap.get(targetChannel.id);
        if (!match) return await replyCommandFail(interaction, commandName, '指定頻道非BP使用頻道');

        matchMap.delete(targetChannel.id);
        match.timeStamp = Date.now();
        const content = `已清除 ${match.channel.name} 的BP流程`;
        await interaction.reply({ content, ephemeral: true });
        await logCommandResult(interaction.user.username, commandName, content);
    }
};

export default {
    func: MatchClear,
    defs: new SlashCommandBuilder()
        .setName(commandName)
        .setDescription('[ 主辦方指令 ] 清除BP流程')
        .addChannelOption((option) =>
            option
                .setName('channel')
                .setDescription('選擇欲清除的BP使用頻道，未填選時，視為選擇使用該指令的當前頻道')
                .addChannelTypes(ChannelType.GuildText)
        )
        .addBooleanOption((option) => option.setName('all').setDescription('選填該選項為True時，無視channel指定，清空所有BP頻道指定')),
};
