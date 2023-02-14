import { SlashCommandBuilder } from 'discord.js';
import { botEnv, getSetting } from '../config/botSettings';
import { CommandFunction } from '../types';
import { genCommandReplier } from '../utils';

const commandName = 'log_config';

type Options_LogConfig = {};

const LogConfig: CommandFunction<Options_LogConfig> = async (interaction) => {
    const reply = genCommandReplier(interaction, commandName);
    if (!botEnv.hasAdminPermission(interaction.member)) return await reply.fail('並非主辦方，無法使用該指令');
    const botSettings = getSetting();
    interaction.reply({
        content: Object.getOwnPropertyNames(botSettings)
            .map((key) => key + ': `' + botSettings[key] + '`')
            .join('\n'),
        ephemeral: true,
    });
};

export default {
    func: LogConfig,
    defs: new SlashCommandBuilder().setName(commandName).setDescription('[ 主辦方指令 ] 輸出機器人設定值'),
};
