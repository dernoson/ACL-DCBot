import { createCommand } from '../commandUtils';
import { assertAdminPermission, configOptions } from '../config';

const configOptionDescs = Object.entries(configOptions).reduce(
    (prev, [value, name]) => ({ ...prev, [value]: name.desc }),
    {} as Record<string, string>
);

export default createCommand('set_config', '[ 主辦方指令 ] 設定環境變數')
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
