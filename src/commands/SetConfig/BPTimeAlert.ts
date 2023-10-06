import { botEnv, dumpSetting } from '../../BotEnv';
import { commandSuccessResp } from '../../utils';
import { ConfigOption } from './types';

export const BPTimeAlert: ConfigOption = {
    desc: '開啟/關閉BP選角時限提醒',
    handler() {
        const BPTimeAlert = botEnv.get('BPTimeAlert');
        if (!BPTimeAlert) {
            botEnv.set('BPTimeAlert', 1);
            dumpSetting();
            return commandSuccessResp('BP選角時限提醒：開啟');
        } else {
            botEnv.set('BPTimeAlert', undefined);
            dumpSetting();
            return commandSuccessResp('BP選角時限提醒：關閉');
        }
    },
};
