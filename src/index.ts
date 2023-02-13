import { Client, REST, Routes } from 'discord.js';
import { BotToken, BotClientID } from './secret/tokens';
import type { CommandExport } from './types';
import { getCommandOptions } from './utils';
import { IntentOptions } from './config/optionSettings';
import { botEnv } from './config/botSettings';

import SetEnv from './commands/SetEnv';
import Test from './commands/Test';
import MatchSet from './commands/MatchSet';
import MatchStart from './commands/MatchStart';
import MatchClear from './commands/MatchClear';
import SetConfig from './commands/SetConfig';
import Select from './commands/Select';

const commands: CommandExport[] = [Test, Select, MatchSet, MatchStart, MatchClear, SetEnv, SetConfig];
const commandsDef = commands.map((o) => o.defs);
const commandsFunc: { [key: string]: CommandExport['func'] } = commands.reduce((prev, curr) => {
    const name = curr.defs.name;
    if (!name) return prev;
    return { ...prev, [name]: curr.func };
}, {});

const rest = new REST().setToken(BotToken);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');
        await rest.put(Routes.applicationCommands(BotClientID), { body: commandsDef });
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

    const func = commandsFunc[interaction.commandName];
    if (!func) return;
    func(interaction, getCommandOptions(interaction.options, client));
});

client.login(BotToken);
