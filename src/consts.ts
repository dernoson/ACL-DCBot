import { ClientOptions, GatewayIntentBits, MessageMentionOptions, PermissionOverwriteOptions } from 'discord.js';

export const normalMentionOptions: MessageMentionOptions = { parse: ['roles', 'users'] };

export const clientOptions: ClientOptions = {
    intents: [
        GatewayIntentBits.Guilds, //
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
    ],
};

export const channelPermission: PermissionOverwriteOptions = {
    ViewChannel: true,
    ManageChannels: false,
    ManageGuild: false,
    ManageWebhooks: false,
    CreateInstantInvite: false,
    SendMessages: true,
    SendMessagesInThreads: true,
    CreatePublicThreads: false,
    CreatePrivateThreads: false,
    EmbedLinks: true,
    AttachFiles: true,
    AddReactions: true,
    UseExternalEmojis: true,
    UseExternalStickers: true,
    MentionEveryone: false,
    ManageMessages: false,
    ManageThreads: false,
    ReadMessageHistory: true,
    SendTTSMessages: false,
    UseApplicationCommands: true,
};
