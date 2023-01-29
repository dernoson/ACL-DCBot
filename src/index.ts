import { Client, GatewayIntentBits, REST, Routes } from 'discord.js';
import { BotToken, BotClientID } from './secret/tokens';
import { CommandExport } from './types';

import Ping from './commands/Ping';
import { getCommandOptions } from './utils';

const commands: CommandExport[] = [Ping];
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

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.on('ready', (client) => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async (interaction) => {
    if (!client.isReady) return;
    if (!interaction.isChatInputCommand()) return;

    const func = commandsFunc[interaction.commandName];
    if (!func) return;
    func(interaction, getCommandOptions(interaction.options, client));
});

client.login(BotToken);
