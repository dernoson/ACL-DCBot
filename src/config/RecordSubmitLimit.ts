import { commandSuccessResp } from '../commandUtils';
import { setConfigValue } from './functions';
import { ConfigOption } from './types';

export const ResultSubmitLimit: ConfigOption = {
    desc: '作戰紀錄繳交期限(天數)',
    handler(ctx, value) {
        if (!value || +value == 0) {
            setConfigValue('ResultSubmitLimit', undefined);
            return commandSuccessResp('作戰紀錄繳交期限：不限');
        } else if (!Number.isInteger(+value) || +value < 0) {
            throw '僅可輸入正整數';
        }

        const days = +value;
        setConfigValue('ResultSubmitLimit', days);
        return commandSuccessResp(`作戰紀錄繳交期限： ${days} 天後`);
    },
};
