import { SlashCommandBuilder } from 'discord.js';
import { botEnv, dumpSetting } from '../config/botSettings';
import { defaultMatchFlowSetting, matchFlowMap, matchFlowMapKeysArr } from '../match';
import { CommandFunction, OptionType } from './types';
import { genCommandReplier, getObjectKeys } from './utils';

const commandName = 'set_config';

type Options_SetConfig = {
    option: keyof typeof configOptions;
    value?: OptionType['String'];
};

const SetConfig: CommandFunction<Options_SetConfig> = async (interaction, args) => {
    const reply = genCommandReplier(interaction, commandName);
    if (!botEnv.hasAdminPermission(interaction.member)) return await reply.fail('並非主辦方，無法使用該指令');

    return await configOptions[args.option].handler(interaction, args);
};

type ConfigOption = {
    desc: string;
    handler: CommandFunction<{ value?: string }>;
};

const createConfigOptionMap = <M extends { [key: string]: ConfigOption }>(map: M) => map;

const configOptions = createConfigOptionMap({
    BPTimeLimit: {
        desc: 'BP選角時限秒數',
        handler: async (interaction, { value }) => {
            const reply = genCommandReplier(interaction, commandName);

            if (!value) {
                botEnv.set('BPTimeLimit', undefined);
                dumpSetting();
                await reply.success('[設定機器人環境] BP選角時限秒數：不限', true, true);
            } else if (isNaN(+value)) {
                await reply.fail('BPTimeLimit 僅可輸入純數字');
            } else if (+value < 1 || +value > 1000) {
                await reply.fail('BPTimeLimit 僅可接受 1~1000 的數值');
            } else {
                const second = +value;
                botEnv.set('BPTimeLimit', +second);
                dumpSetting();
                await reply.success(`[設定機器人環境] BP選角時限秒數： ${second} 秒`, true, true);
            }
        },
    },
    MatchFlow: {
        desc: 'BP使用流程',
        handler: async (interaction, { value }) => {
            const reply = genCommandReplier(interaction, commandName);
            if (!value) {
                botEnv.set('MatchFlow', undefined);
                dumpSetting();
                await reply.success(`[設定機器人環境] BP流程設置：${defaultMatchFlowSetting.desc}`, true, true);
            } else if (matchFlowMapKeysArr.includes(value as any)) {
                botEnv.set('MatchFlow', value);
                dumpSetting();
                await reply.success(`[設定機器人環境] BP流程設置：${matchFlowMap[value].desc}`, true, true);
            } else {
                const settingDesc = getObjectKeys(matchFlowMap)
                    .map((key) => `\`${key}\` : ${matchFlowMap[key].desc}`)
                    .join('\n');
                await reply.fail(`MatchFlow僅可接受以下字串值：\n${settingDesc}`);
            }
        },
    },
});

export default {
    func: SetConfig,
    defs: new SlashCommandBuilder()
        .setName(commandName)
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
