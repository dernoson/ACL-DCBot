import { Client, REST, Routes } from 'discord.js';
import { BotToken, BotClientID } from './secret/tokens';
import { CommandExport } from './types';
import { getCommandOptions, logCommandResult } from './utils';
import { IntentOptions, normalMentionOptions } from './config/optionSettings';
import { botEnv } from './config/botSettings';

import SetEnv from './commands/SetEnv';
import MatchSet from './commands/MatchSet';
import MatchStart from './commands/MatchStart';
import MatchClear from './commands/MatchClear';
import MatchConfirm from './commands/MatchConfirm';
import MatchLaststep from './commands/MatchLaststep';
import LogMatch from './commands/LogMatch';
import LogConfig from './commands/LogConfig';
import SetConfig from './commands/SetConfig';
import Select from './commands/Select';
import { Help, helpDefs } from './commands/Help';
import HelloWorld from './commands/HelloWorld';

const commands: CommandExport[] = [
    Select,
    MatchSet,
    MatchStart,
    MatchClear,
    MatchConfirm,
    MatchLaststep,
    LogMatch,
    SetEnv,
    LogConfig,
    SetConfig,
];

const commandDefs = commands.map((o) => o.defs).concat(helpDefs);

const commandHandlers: { [key: string]: CommandExport['func'] } = commands.reduce(
    (prev, curr) => {
        const name = curr.defs.name;
        if (!name) return prev;
        return { ...prev, [name]: curr.func };
    },
    {
        [HelloWorld.defs.name]: HelloWorld.func,
    }
);

const rest = new REST().setToken(BotToken);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');
        await rest.put(Routes.applicationCommands(BotClientID), { body: commandDefs.concat(HelloWorld.defs) });
        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();

const client = new Client({ intents: IntentOptions });

client.on('ready', (client) => {
    console.log(`Logged in as ${client.user.tag}!`);
    botEnv.onBotReady(client);
});

client.on('interactionCreate', async (interaction) => {
    if (!client.isReady) return;
    if (!interaction.isChatInputCommand()) return;

    const commandName = interaction.commandName;
    if (commandName == 'help') {
        Help(interaction, commandDefs);
        return;
    }

    const username = interaction.user.username;
    const handler = commandHandlers[commandName];
    if (!handler) return;
    try {
        const result = handler(interaction, getCommandOptions(interaction.options, client));
        const { content, log } = typeof result == 'string' ? { content: result, log: undefined } : result;
        log && logCommandResult(commandName, 'success', username, log);
        await interaction.reply({ content, ephemeral: typeof result != 'string' && result.ephemeral, allowedMentions: normalMentionOptions });
    } catch (error) {
        const errorLog = typeof error == 'string' ? error : '未知錯誤';
        if (typeof error != 'string') console.log(error);
        logCommandResult(commandName, 'fail', username, errorLog);
        await interaction.reply({ content: errorLog, ephemeral: true });
    }
});

client.login(BotToken);
