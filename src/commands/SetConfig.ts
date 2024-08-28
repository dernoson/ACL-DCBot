import { assertAdminPermission, configOptionDescs, configOptions } from '../config';
import { BotCommand } from '../utils';

export default new BotCommand('set_config', '[ 主辦方指令 ] 設定環境變數')
    .option_String('option', '選擇要設定的變數選項', true, configOptionDescs)
    .option_String('value', '設定值')
    .callback((ctx, { option, value }) => {
        assertAdminPermission(ctx);

        try {
            return configOptions[option].handler(ctx, value);
        } catch (error) {
            throw `[ ${option} ] ${error}`;
        }
    });
