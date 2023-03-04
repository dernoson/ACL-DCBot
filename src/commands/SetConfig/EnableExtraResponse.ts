import { botEnv, dumpSetting } from '../../config/botSettings';
import { commandSuccessResp } from '../../utils';
import { ConfigOption } from './types';

export const EnableExtraResponse: ConfigOption = {
    desc: '是否啟動機器人回應彩蛋',
    handler(ctx, value) {
        if (!value || value.toLowerCase() == 'false') {
            botEnv.set('EnableExtraResponse', undefined);
            dumpSetting();
            return commandSuccessResp('[設定機器人環境] 機器人回應彩蛋：關閉');
        } else if (value && value.toLowerCase() == 'true') {
            botEnv.set('EnableExtraResponse', 1);
            dumpSetting();
            return commandSuccessResp('[設定機器人環境] 機器人回應彩蛋：開啟');
        } else {
            throw '[ EnableExtraResponse ] 僅可接受 true/false 值';
        }
    },
};
