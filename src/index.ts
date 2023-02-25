import { Client, REST, Routes } from 'discord.js';
import { BotToken, BotClientID } from './secret/tokens';
import type { CommandExport } from './types';
import { createCommandContext, getCommandOptions } from './utils';
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

const commands: CommandExport[] = [
    Select,
    MatchSet,
    MatchStart,
    MatchClear,
    MatchConfirm,
    MatchLaststep,
    LogMatch,
    LogConfig,
    SetEnv,
    SetConfig,
];

const commandDefs = commands.map((o) => o.defs);

const commandHandlers: { [key: string]: CommandExport['func'] } = commands.reduce((prev, curr) => {
    const name = curr.defs.name;
    if (!name) return prev;
    return { ...prev, [name]: curr.func };
}, {});

const rest = new REST().setToken(BotToken);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');
        await rest.put(Routes.applicationCommands(BotClientID), { body: commandDefs });
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

    const handler = commandHandlers[interaction.commandName];
    if (!handler) return;
    const result = await handler(createCommandContext(interaction, interaction.commandName), getCommandOptions(interaction.options, client));
    const content = typeof result == 'string' ? result : result.content;
    interaction.reply({ content, ephemeral: typeof result != 'string' && result.ephemeral, allowedMentions: normalMentionOptions });
});

client.login(BotToken);
