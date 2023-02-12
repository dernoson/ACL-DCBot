import { SlashCommandBuilder } from 'discord.js';
import { botEnv, dumpSetting } from '../config/botSettings';
import { CommandFunction } from '../types';
import { logCommandResult, replyCommandFail } from '../utils';

const commandName = 'set_config';

type Options_SetConfig = {
    option: 'BPTimeLimit';
    value?: string;
};

const SetConfig: CommandFunction<Options_SetConfig> = async (interaction, args) => {
    if (!botEnv.hasAdminPermission(interaction.member)) return await replyCommandFail(interaction, commandName, '並非主辦方，無法使用該指令');
    switch (args.option) {
        case 'BPTimeLimit':
            await setBPTimeLimit(interaction, args);
            break;
    }
};

const setBPTimeLimit: CommandFunction<Options_SetConfig & { option: 'BPTimeLimit' }> = async (interaction, { option, value }) => {
    if (!value) {
        botEnv.set(option, undefined);
        dumpSetting();
        const content = '[設定機器人環境] BP選角時限秒數：不限';
        await interaction.reply({ content, ephemeral: true });
        await logCommandResult(interaction.user.username, commandName, content);
    } else if (isNaN(+value)) {
        await replyCommandFail(interaction, commandName, 'BPTimeLimit 僅可輸入純數字');
    } else if (+value < 1 || +value > 1000) {
        await replyCommandFail(interaction, commandName, 'BPTimeLimit 僅可接受 1~1000 的數值');
    } else {
        const second = +value;
        botEnv.set(option, +second);
        dumpSetting();
        const content = `[設定機器人環境] BP選角時限秒數： ${second} 秒`;
        await interaction.reply({ content, ephemeral: true });
        await logCommandResult(interaction.user.username, commandName, content);
    }
};

export default {
    func: SetConfig,
    defs: new SlashCommandBuilder()
        .setName(commandName)
        .setDescription('[ 主辦方指令 ] 設定環境變數')
        .addStringOption((option) =>
            option
                .setName('option')
                .setDescription('選擇要設定的變數選項')
                .addChoices({ name: 'BP選角時限秒數', value: 'BPTimeLimit' })
                .setRequired(true)
        )
        .addStringOption((option) => option.setName('value').setDescription('設定值')),
};
