import { createCommand } from '../commandUtils';
import { assertAdminPermission, configOptionDescs, getConfig } from '../config';
import { createLogString } from '../utils';

export default createCommand('log_config', '[ 主辦方指令 ] 輸出機器人設定值') //
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
