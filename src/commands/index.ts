import { EmbedBuilder } from 'discord.js';
import { BotCommand, CommandExecute } from '../utils';
import SetEnv from './SetEnv';
import MatchSet from './MatchSet';
import MatchStart from './MatchStart';
import MatchClear from './MatchClear';
import MatchConfirm from './MatchConfirm';
import MatchLaststep from './MatchLaststep';
import LogMatch from './LogMatch';
import LogConfig from './LogConfig';
import SetConfig from './SetConfig';
import Select from './Select';

const commands = [
    Select, //
    MatchSet,
    MatchStart,
    MatchClear,
    MatchConfirm,
    MatchLaststep,
    LogMatch,
    LogConfig,
    SetConfig,
    SetEnv,
];

export const commandDefs = commands.map((command) => command.getBuilder());

export const commandFunctions: Record<string, CommandExecute> = commands.reduce((prev, command) => {
    const name = command.getBuilder().name;
    return { ...prev, [name]: command.getExecute() };
}, {});

export const Help = new BotCommand('help', '機器人講解') //
    .callback(() => {
        const embed = new EmbedBuilder()
            .setTitle('Arknights ACL Bot')
            .setDescription('機器人可使用指令')
            .addFields(...commandDefs.map((d) => ({ name: d.name, value: d.description })))
            .setTimestamp()
            .setColor('DarkAqua');

        return { embeds: [embed], ephemeral: true };
    });
