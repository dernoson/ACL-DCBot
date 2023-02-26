import { SlashCommandBuilder } from 'discord.js';
import { getSetting } from '../config/botSettings';
import { CommandFunction } from '../types';
import { checkAdminPermission } from '../utils';

const LogConfig: CommandFunction = (ctx) => {
    checkAdminPermission(ctx);
    const botSettings = getSetting();
    return {
        content: Object.getOwnPropertyNames(botSettings)
            .map((key) => key + ': `' + botSettings[key] + '`')
            .join('\n'),
        ephemeral: true,
    };
};

export default {
    func: LogConfig,
    defs: new SlashCommandBuilder().setName('log_config').setDescription('[ 主辦方指令 ] 輸出機器人設定值'),
};
