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
import { CommandExecute } from '../commandUtils';

const commands = [
    Select, //
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

export const commandDefs = commands.map((command) => command.getBuilder());

export const commandFunctions: Record<string, CommandExecute> = commands.reduce((prev, command) => {
    const name = command.getBuilder().name;
    return { ...prev, [name]: command.getExecute() };
}, {});
