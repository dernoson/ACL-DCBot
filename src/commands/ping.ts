import { CommandFunction } from '../types';

export const ping: CommandFunction = async (interaction) => {
    const delay = interaction.options.getInteger('delay', true);
    await interaction.reply('Set success!');
    setTimeout(() => {
        interaction.channel?.send(`Pong! (${delay})`);
    }, delay * 1000);
};
