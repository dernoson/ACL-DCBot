import { botEnv, dumpSetting } from '../../config/botSettings';
import { defaultMatchMode, MatchMode, matchModeMap } from '../../match';
import { commandSuccessResp, getObjectKeys } from '../../utils';
import { ConfigOption } from './types';

export const MatchFlow: ConfigOption = {
    desc: 'BP使用流程',
    handler(ctx, value) {
        if (!value) {
            botEnv.set('MatchFlow', undefined);
            dumpSetting();
            return commandSuccessResp(`[設定機器人環境] BP流程設置：${matchModeMap[defaultMatchMode].desc}`);
        } else if (isMatchMode(value)) {
            botEnv.set('MatchFlow', value);
            dumpSetting();
            return commandSuccessResp(`[設定機器人環境] BP流程設置：${matchModeMap[value].desc}`);
        } else {
            throw `僅可接受以下字串值：\n${MatchModeArr.map((key) => `\`${key}\` : ${matchModeMap[key].desc}`).join('\n')}`;
        }
    },
};

const MatchModeArr = getObjectKeys(MatchMode);

const isMatchMode = (value: string): value is MatchMode => MatchModeArr.includes(value as MatchMode);
