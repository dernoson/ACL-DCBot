import { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } from 'discord.js';
import { ping } from './commands/ping';
import { BotToken, BotClientID } from './secret/tokens';

// const commands = [
//     {
//         name: 'ping',
//         description: 'Replies with Pong!',
//     },
// ];

const commands = [
    new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!')
        .addIntegerOption((option) => option.setName('delay').setDescription('delay seconds').setRequired(true)),
];

const rest = new REST().setToken(BotToken);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');
        await rest.put(Routes.applicationCommands(BotClientID), { body: commands });
        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.on('ready', () => {
    client.user && console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    switch (interaction.commandName) {
        case 'ping':
            await ping(interaction);
    }
});

client.login(BotToken);
