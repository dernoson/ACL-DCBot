import { botEnv, dumpSetting } from '../../BotEnv';
import { commandSuccessResp } from '../../functions';
import { responsePlugins } from '../../responses';
import { ConfigOption } from './types';

export const ResponsePlugin: ConfigOption = {
    desc: '設定回覆彩蛋使用套件',
    handler(ctx, value) {
        if (!value) {
            botEnv.set('ResponsePlugin', undefined);
            dumpSetting();
            return commandSuccessResp('回覆彩蛋使用套件：無');
        } else if (responsePluginsArr.includes(value)) {
            botEnv.set('ResponsePlugin', value);
            dumpSetting();
            return commandSuccessResp('回覆彩蛋使用套件：' + responsePlugins[value]?.desc);
        } else {
            throw `僅可接受以下字串值：\n${responsePluginsArr.map((key) => `\`${key}\` : ${responsePlugins[key]?.desc}`).join('\n')}`;
        }
    },
};

const responsePluginsArr = Object.getOwnPropertyNames(responsePlugins);
