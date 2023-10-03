import { EmbedBuilder } from 'discord.js';
import { createCommand } from '../commandUtils';
import { commandDefs } from './exports';

export default createCommand('help', '機器人講解') //
    .callback(() => {
        const embed = new EmbedBuilder()
            .setTitle('Arknights ACL Bot')
            .setDescription('機器人可使用指令')
            .addFields(...commandDefs.map((d) => ({ name: d.name, value: d.description })))
            .setTimestamp()
            .setColor('DarkAqua');

        return { embeds: [embed], ephemeral: true };
    });
