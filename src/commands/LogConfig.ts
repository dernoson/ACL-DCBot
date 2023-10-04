import { getSetting } from '../BotEnv';
import { checkAdminPermission } from '../utils';
import { createCommand } from '../commandUtils';

export default createCommand('log_config', '[ 主辦方指令 ] 輸出機器人設定值') //
    .callback((ctx) => {
        checkAdminPermission(ctx);
        const botSettings = getSetting();
        return {
            content: Object.getOwnPropertyNames(botSettings)
                .map((key) => key + ': `' + botSettings[key] + '`')
                .join('\n'),
            ephemeral: true,
        };
    });
