import { createCommand } from '../commandUtils';
import { assertAdminPermission, getConfig } from '../config';
import { createLogString, getObjectEntries } from '../utils';

export default createCommand('log_config', '[ 主辦方指令 ] 輸出機器人設定值') //
    .callback((ctx) => {
        assertAdminPermission(ctx);

        const config = getConfig();

        return {
            content: createLogString(
                ...getObjectEntries(config).map(([key, value]) => `${key}: \`${value}\``) //
            ),
            ephemeral: true,
        };
    });
