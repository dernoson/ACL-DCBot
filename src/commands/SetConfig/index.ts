import { SlashCommandBuilder } from 'discord.js';
import { botEnv } from '../../config/botSettings';
import { BPTimeLimit } from './BPTimeLimit';
import { MatchFlow } from './MatchFlow';
import { CommandFunction, OptionType } from '../../types';
import { getObjectKeys } from '../../utils';
import { ConfigOption } from './types';

type Options_SetConfig = {
    option: keyof typeof configOptions;
    value?: OptionType['String'];
};

const SetConfig: CommandFunction<Options_SetConfig> = async (replier, args) => {
    if (!botEnv.hasAdminPermission(replier.interaction.member)) return await replier.fail('並非主辦方，無法使用該指令');

    return await configOptions[args.option].handler(replier, args.value);
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
