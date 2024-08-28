import { BaseGuildTextChannel, Client, REST, Routes } from 'discord.js';
import { getMatchStorage, recoverMatchStorage } from './match';
import { extraResponse } from './responses';
import { Help, commandDefs, commandFunctions } from './commands';
import { clientOptions } from './consts';
import { getEnv, initEnv, readConfig } from './config';
import { readJson, hasSendMessagePermission } from './utils';

const main = async () => {
    const helpCommandBuilder = Help.getBuilder();
    const requestDataBody = commandDefs.concat(helpCommandBuilder);
    const interactionExecutes = {
        ...commandFunctions,
        [helpCommandBuilder.name]: Help.getExecute(),
    };

    const { BotToken, BotClientID } = await readJson('secret.json');

    new REST()
        .setToken(BotToken)
        .put(Routes.applicationCommands(BotClientID), { body: requestDataBody })
        .then(() => console.log('Successfully reloaded application (/) commands.'))
        .catch((error) => console.error(error));

    const client = new Client(clientOptions);

    client.on('ready', async (client) => {
        await readConfig();
        initEnv(client);
        await recoverMatchStorage();

        isBotReady = true;
        console.log(`Logged in as ${client.user.tag}!`);
    });

    client.on('messageCreate', async (message) => {
        try {
            if (!isBotReady) return;
            if (!message.inGuild() || message.author.bot) return;
            if (!hasSendMessagePermission(message.guild, message.channel)) return;

            if (message.channelId == getEnv().logChannel?.id) return;
            if (message.channel instanceof BaseGuildTextChannel && getMatchStorage(message.channel)) return;

            const resp = extraResponse(message);
            if (resp) await message.reply(resp);
        } catch (error) {
            console.log(error);
        }
    });

    client.on('interactionCreate', async (interaction) => {
        try {
            if (!interaction.isChatInputCommand()) return;
            if (!interaction.inGuild() || !interaction.guild || !interaction.channel) return;
            if (!hasSendMessagePermission(interaction.guild, interaction.channel)) return;
            if (!isBotReady) await interaction.reply('機器人尚未就緒');

            await interactionExecutes[interaction.commandName]?.(interaction);
        } catch (error) {
            console.log(error);
        }
    });

    client.login(BotToken);

    let isBotReady = false;
};

main();
