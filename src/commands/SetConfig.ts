import { SlashCommandBuilder } from 'discord.js';
import { botEnv, dumpSetting } from '../config/botSettings';
import { CommandFunction, OptionType } from '../types';
import { genCommandReplier } from '../utils';

const commandName = 'set_config';

type Options_SetConfig = {
    option: 'BPTimeLimit';
    value?: OptionType['String'];
};

const SetConfig: CommandFunction<Options_SetConfig> = async (interaction, args) => {
    const reply = genCommandReplier(interaction, commandName);
    if (!botEnv.hasAdminPermission(interaction.member)) return await reply.fail('並非主辦方，無法使用該指令');

    switch (args.option) {
        case 'BPTimeLimit':
            return await setBPTimeLimit(interaction, args);
    }
};

const setBPTimeLimit: CommandFunction<Options_SetConfig & { option: 'BPTimeLimit' }> = async (interaction, { option, value }) => {
    const reply = genCommandReplier(interaction, commandName);

    if (!value) {
        botEnv.set(option, undefined);
        dumpSetting();
        await reply.success('[設定機器人環境] BP選角時限秒數：不限', true, true);
    } else if (isNaN(+value)) {
        await reply.fail('BPTimeLimit 僅可輸入純數字');
    } else if (+value < 1 || +value > 1000) {
        await reply.fail('BPTimeLimit 僅可接受 1~1000 的數值');
    } else {
        const second = +value;
        botEnv.set(option, +second);
        dumpSetting();
        await reply.success(`[設定機器人環境] BP選角時限秒數： ${second} 秒`, true, true);
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
