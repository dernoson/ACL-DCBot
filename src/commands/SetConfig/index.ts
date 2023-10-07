import { BPTimeLimit } from './BPTimeLimit';
import { BPTimeAlert } from './BPTimeAlert';
import { MatchFlow } from './MatchFlow';
import { ResponsePlugin } from './ResponsePlugin';
import { createRestrictObj, getObjectEntries } from '../../utils';
import { ConfigOption } from './types';
import { createCommand } from '../../commandUtils';
import { assertAdminPermission } from '../../BotEnv';

const configOptions = createRestrictObj<Record<string, ConfigOption>>()({
    BPTimeLimit,
    BPTimeAlert,
    MatchFlow,
    ResponsePlugin,
});

const optionDescs = getObjectEntries(configOptions).reduce(
    (prev, [value, name]) => ({ ...prev, [value]: name.desc }),
    {} as Record<keyof typeof configOptions, string>
);

export default createCommand('set_config', '[ 主辦方指令 ] 設定環境變數')
    .option_String('option', '選擇要設定的變數選項', true, optionDescs)
    .option_String('value', '設定值')
    .callback((ctx, { option, value }) => {
        assertAdminPermission(ctx);
        try {
            return configOptions[option].handler(ctx, value);
        } catch (error) {
            throw `[ ${option} ] ${error}`;
        }
    });
