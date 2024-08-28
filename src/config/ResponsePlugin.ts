import { commandSuccessResp } from '../utils';
import { isResponsePluginKey, responsePlugins } from '../responses';
import { createLogString } from '../utils';
import { setConfigValue } from './functions';
import { ConfigOption } from './types';

export const ResponsePlugin: ConfigOption = {
    desc: '設定回覆彩蛋使用套件',
    handler(ctx, value) {
        if (!value) {
            setConfigValue('ResponsePlugin', undefined);
            return commandSuccessResp('回覆彩蛋使用套件：無');
        } else if (isResponsePluginKey(value)) {
            setConfigValue('ResponsePlugin', value);
            return commandSuccessResp('回覆彩蛋使用套件：' + responsePluginDesc[value]);
        } else {
            throw createLogString(
                '僅可接受以下字串值：', //
                ...Object.entries(responsePluginDesc).map(([key, desc]) => `\`${key}\` : ${desc}`)
            );
        }
    },
};

export const responsePluginDesc = Object.entries(responsePlugins).reduce(
    (prev, [key, plugin]) => ({ ...prev, [key]: plugin.desc }),
    {} as Record<string, string>
);
