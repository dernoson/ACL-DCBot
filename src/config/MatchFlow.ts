import { commandSuccessResp } from '../functions';
import { defaultMatchMode, isMatchMode, matchModeDesc } from '../match';
import { createLogString, getObjectEntries } from '../utils';
import { setConfigValue } from './functions';
import { ConfigOption } from './types';

export const MatchFlow: ConfigOption = {
    desc: 'BP使用流程',
    handler(ctx, value) {
        if (!value) {
            setConfigValue('MatchFlow', undefined);
            return commandSuccessResp(`預設BP流程：${matchModeDesc[defaultMatchMode]}`);
        }
        if (isMatchMode(value)) {
            setConfigValue('MatchFlow', value);
            return commandSuccessResp(`BP流程設置：${matchModeDesc[value]}`);
        } else {
            throw createLogString(
                '僅可接受以下字串值：', //
                ...getObjectEntries(matchModeDesc).map(([key, desc]) => `\`${key}\` : ${desc}`)
            );
        }
    },
};
