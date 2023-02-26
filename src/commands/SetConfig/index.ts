import { SlashCommandBuilder } from 'discord.js';
import { BPTimeLimit } from './BPTimeLimit';
import { MatchFlow } from './MatchFlow';
import { CommandFunction, OptionType } from '../../types';
import { checkAdminPermission, getObjectKeys } from '../../utils';
import { ConfigOption } from './types';

type Options_SetConfig = {
    option: keyof typeof configOptions;
    value?: OptionType['String'];
};

const SetConfig: CommandFunction<Options_SetConfig> = (ctx, args) => {
    checkAdminPermission(ctx);
    return configOptions[args.option].handler(ctx, args.value);
};

const createConfigOptionMap = <M extends { [key: string]: ConfigOption }>(map: M) => map;

const configOptions = createConfigOptionMap({
    BPTimeLimit,
    MatchFlow,
});

export default {
    func: SetConfig,
    defs: new SlashCommandBuilder()
        .setName('set_config')
        .setDescription('[ 主辦方指令 ] 設定環境變數')
        .addStringOption((option) =>
            option
                .setName('option')
                .setDescription('選擇要設定的變數選項')
                .addChoices(...getObjectKeys(configOptions).map((value) => ({ name: configOptions[value].desc, value })))
                .setRequired(true)
        )
        .addStringOption((option) => option.setName('value').setDescription('設定值')),
};
