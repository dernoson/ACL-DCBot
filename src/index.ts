import { BaseGuildTextChannel, Client, GatewayIntentBits, PermissionFlagsBits, REST, Routes } from 'discord.js';
import { BotToken, BotClientID } from './secret/tokens';
import { botEnv } from './BotEnv';
import { getMatchStorage, recoverMatchStorage } from './match';
import { extraResponse } from './responses';
import { Help, commandDefs, commandFunctions } from './commands';
import { writeError } from './fileHandlers';

const helpCommandBuilder = Help.getBuilder();
const requestDataBody = commandDefs.concat(helpCommandBuilder);
const interactionExecutes = { ...commandFunctions, [helpCommandBuilder.name]: Help.getExecute() };

new REST()
    .setToken(BotToken)
    .put(Routes.applicationCommands(BotClientID), { body: requestDataBody })
    .then(() => console.log('Successfully reloaded application (/) commands.'))
    .catch((error) => console.error(error));

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

client.on('ready', async (client) => {
    await botEnv.onBotReady(client);
    await recoverMatchStorage(client);
    console.log(`Logged in as ${client.user.tag}!`);
    envIsReady = true;
});

client.on('messageCreate', async (message) => {
    try {
        if (!envIsReady) return;
        if (!message.inGuild() || message.author.bot) return;
        if (message.channelId == botEnv.logChannel?.id) return;
        if (message.channel instanceof BaseGuildTextChannel && getMatchStorage(message.channel)) return;
        const selfMember = message.guild.members.me;
        if (!selfMember?.permissions.has(PermissionFlagsBits.SendMessages)) return;
        if (!selfMember?.permissionsIn(message.channel).has(PermissionFlagsBits.SendMessages)) return;

        const resp = extraResponse(message);
        if (resp) await message.reply(resp);
    } catch (error) {
        writeError(error);
    }
});

client.on('interactionCreate', async (interaction) => {
    try {
        if (!interaction.inGuild() || !interaction.isChatInputCommand()) return;
        if (!envIsReady) await interaction.reply('機器人尚未就緒');
        await interactionExecutes[interaction.commandName]?.(interaction);
    } catch (error) {
        writeError(error);
    }
});

client.login(BotToken);

let envIsReady = false;
