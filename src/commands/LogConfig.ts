import { BotCommand, createLogString } from '../utils';
import { assertAdminPermission, configOptionDescs, getConfig } from '../config';

export default new BotCommand('log_config', '[ 主辦方指令 ] 輸出機器人設定值') //
    .callback((ctx) => {
        assertAdminPermission(ctx);

        const config = getConfig();

        return {
            content: createLogString(
                ...Object.entries(config).map(([key, value]) => {
                    const desc = configOptionDescs[key] ?? key;
                    return `${desc}: \`${value}\``;
                })
            ),
            ephemeral: true,
        };
    });
