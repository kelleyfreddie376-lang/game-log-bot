const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    ChannelType
} = require("discord.js");

const db = require("../database/database");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("setup-logs")
        .setDescription("Set up the GameLog server logging system.")
        .setDefaultMemberPermissions(
            PermissionFlagsBits.ManageGuild
        ),

    async execute(interaction) {
        const guild = interaction.guild;

        await interaction.deferReply({
            ephemeral: true
        });

        try {
            let category = guild.channels.cache.find(
                channel =>
                    channel.type === ChannelType.GuildCategory &&
                    channel.name === "📋 GAMELOG LOGS"
            );

            if (!category) {
                category = await guild.channels.create({
                    name: "📋 GAMELOG LOGS",
                    type: ChannelType.GuildCategory
                });
            }

            async function getOrCreateChannel(name, topic) {
                let channel = guild.channels.cache.find(
                    existing =>
                        existing.type === ChannelType.GuildText &&
                        existing.name === name &&
                        existing.parentId === category.id
                );

                if (!channel) {
                    channel = await guild.channels.create({
                        name,
                        type: ChannelType.GuildText,
                        parent: category.id,
                        topic
                    });
                }

                return channel;
            }

            const memberLogs = await getOrCreateChannel(
                "📥・member-logs",
                "GameLog member join and leave logs."
            );

            const messageLogs = await getOrCreateChannel(
                "💬・message-logs",
                "GameLog message deletion and edit logs."
            );

            const moderationLogs = await getOrCreateChannel(
                "🛡️・moderation-logs",
                "GameLog moderation logs."
            );

            const serverLogs = await getOrCreateChannel(
                "⚙️・server-logs",
                "GameLog server configuration logs."
            );

            const botLogs = await getOrCreateChannel(
                "🎮・bot-logs",
                "GameLog bot activity logs."
            );

            // Use the member log channel as the primary log channel for now.
            db.prepare(`
                INSERT INTO guild_settings
                (guild_id, log_channel_id, games_enabled)
                VALUES (?, ?, 1)
                ON CONFLICT(guild_id)
                DO UPDATE SET log_channel_id = excluded.log_channel_id
            `).run(
                guild.id,
                memberLogs.id
            );

            await interaction.editReply({
                content:
                    "✅ **GameLog logging has been set up!**\n\n" +
                    `📥 Member Logs: ${memberLogs}\n` +
                    `💬 Message Logs: ${messageLogs}\n` +
                    `🛡️ Moderation Logs: ${moderationLogs}\n` +
                    `⚙️ Server Logs: ${serverLogs}\n` +
                    `🎮 Bot Logs: ${botLogs}`
            });

        } catch (error) {
            console.error("❌ Log setup failed:", error);

            await interaction.editReply({
                content:
                    "❌ I couldn't finish setting up the logging system.\n\n" +
                    "Make sure GameLog has **Manage Channels** permission."
            });
        }
    }
};