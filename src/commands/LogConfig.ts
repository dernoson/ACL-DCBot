import { SlashCommandBuilder } from 'discord.js';
import { botEnv, getSetting } from '../config/botSettings';
import { CommandFunction } from '../types';

const LogConfig: CommandFunction = async (ctx) => {
    if (!botEnv.hasAdminPermission(ctx.interaction.member)) return await ctx.fail('並非主辦方，無法使用該指令');
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
