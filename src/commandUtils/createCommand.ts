import { ApplicationCommandOptionAllowedChannelTypes, SlashCommandBuilder } from 'discord.js';
import { CommandBuilder, CommandExecute, I_Command, I_FixedCommand } from './types';
import { getObjectEntries } from '../utils';
import { createCommandExecute } from './createCommandExecute';

export const createCommand = (name: string, description: string): I_Command => {
    let builder: CommandBuilder = new SlashCommandBuilder().setName(name).setDescription(description);
    let callback: CommandExecute;

    const command: I_Command = Object.freeze<I_Command & I_FixedCommand>({
        callback(fn) {
            callback = createCommandExecute(fn);
            return command as any;
        },
        permission(permissions) {
            builder = builder.setDefaultMemberPermissions(permissions);
            return command;
        },
        getExecute() {
            return callback;
        },
        getBuilder() {
            return builder;
        },
        option_Boolean(name: string, description: string, required?: boolean) {
            builder = builder.addBooleanOption((op) => {
                return op
                    .setName(name)
                    .setDescription(description)
                    .setRequired(required ?? false);
            });
            return command;
        },
        option_Number(name: string, description: string, required?: boolean, choices?: Record<number, string>) {
            builder = builder.addNumberOption((op) => {
                op = op
                    .setName(name)
                    .setDescription(description)
                    .setRequired(required ?? false);
                if (choices) op = op.addChoices(...getObjectEntries(choices).map(([value, name]) => ({ name, value })));
                return op;
            });
            return command;
        },
        option_Integer(name: string, description: string, required?: boolean, choices?: Record<number, string>) {
            builder = builder.addIntegerOption((op) => {
                op = op
                    .setName(name)
                    .setDescription(description)
                    .setRequired(required ?? false);
                if (choices) op = op.addChoices(...getObjectEntries(choices).map(([value, name]) => ({ name, value })));
                return op;
            });
            return command;
        },
        option_String(name: string, description: string, required?: boolean, choices?: Record<string, string>) {
            builder = builder.addStringOption((op) => {
                op = op
                    .setName(name)
                    .setDescription(description)
                    .setRequired(required ?? false);
                if (choices) op = op.addChoices(...getObjectEntries(choices).map(([value, name]) => ({ name, value })));
                return op;
            });
            return command;
        },
        option_User(name: string, description: string, required?: boolean) {
            builder = builder.addUserOption((op) => {
                return op
                    .setName(name)
                    .setDescription(description)
                    .setRequired(required ?? false);
            });
            return command;
        },
        option_Channel(name: string, description: string, required?: boolean, channelTypes?: ApplicationCommandOptionAllowedChannelTypes[]) {
            builder = builder.addChannelOption((op) => {
                op = op
                    .setName(name)
                    .setDescription(description)
                    .setRequired(required ?? false);
                if (channelTypes) op = op.addChannelTypes(...channelTypes);
                return op;
            });
            return command;
        },
        option_Role(name: string, description: string, required?: boolean) {
            builder = builder.addRoleOption((op) => {
                return op
                    .setName(name)
                    .setDescription(description)
                    .setRequired(required ?? false);
            });
            return command;
        },
        option_Mentionable(name: string, description: string, required?: boolean) {
            builder = builder.addMentionableOption((op) => {
                return op
                    .setName(name)
                    .setDescription(description)
                    .setRequired(required ?? false);
            });
            return command;
        },
        option_Attachment(name: string, description: string, required?: boolean) {
            builder = builder.addAttachmentOption((op) => {
                return op
                    .setName(name)
                    .setDescription(description)
                    .setRequired(required ?? false);
            });
            return command;
        },
    });

    return command;
};
