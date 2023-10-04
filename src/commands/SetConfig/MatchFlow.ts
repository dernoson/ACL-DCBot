import { botEnv, dumpSetting } from '../../config/botSettings';
import { defaultMatchMode, matchModeMap } from '../../match';
import { commandSuccessResp, getObjectKeys } from '../../utils';
import { ConfigOption } from './types';

export const MatchFlow: ConfigOption = {
    desc: 'BP使用流程',
    handler(ctx, value) {
        if (!value) {
            botEnv.set('MatchFlow', undefined);
            dumpSetting();
            return commandSuccessResp(`預設BP流程：${matchModeMap[defaultMatchMode].desc}`);
        }
        const matchMode = matchModeMap[value];
        if (matchMode) {
            botEnv.set('MatchFlow', value);
            dumpSetting();
            return commandSuccessResp(`BP流程設置：${matchMode.desc}`);
        } else {
            throw `僅可接受以下字串值：\n${getObjectKeys(matchModeMap)
                .map((key) => `\`${key}\` : ${matchModeMap[key].desc}`)
                .join('\n')}`;
        }
    },
};
