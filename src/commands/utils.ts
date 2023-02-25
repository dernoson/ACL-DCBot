import { CacheType, ChatInputCommandInteraction } from 'discord.js';
import { botEnv } from '../config/botSettings';

const replyCommandFail = async (interaction: ChatInputCommandInteraction<CacheType>, commandName: string, content: string) => {
    await interaction.reply({ content, ephemeral: true });
    await botEnv.log(`> **[ ${commandName} ] fail**\n\`by ${interaction.user.username} at <${new Date()}>\`\n${content}`);
};

const logCommandResult = async (userName: string, commandName: string, content: string) => {
    await botEnv.log(`> **[ ${commandName} ] success**\n\`by ${userName} at <${new Date()}>\`\n${content}`);
};

export const genCommandReplier = (interaction: ChatInputCommandInteraction<CacheType>, commandName: string) => ({
    fail: async (content: string) => await replyCommandFail(interaction, commandName, content),
    success: async (content: string, replyToUser?: boolean, ephemeral?: boolean) => {
        await logCommandResult(interaction.user.username, commandName, content);
        replyToUser && interaction.reply({ content, ephemeral });
    },
});

export type CommandReplier = ReturnType<typeof genCommandReplier>;
