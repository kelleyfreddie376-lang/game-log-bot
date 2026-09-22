const {
    EmbedBuilder
} = require("discord.js");

const {
    updateBotStatus
} = require("../services/updateAnnouncer");

const packageJson = require("../../package.json");

const BOT_LOG_CHANNEL_ID = "1551696481965178940";
const STATUS_MESSAGE_ID = "1551747051958702131";

module.exports = {
    name: "clientReady",
    once: true,

    async execute(client) {
        try {
            const channel = await client.channels
                .fetch(BOT_LOG_CHANNEL_ID)
                .catch(() => null);

            if (!channel || !channel.isTextBased()) {
                console.log(
                    "⚠️ GameLog bot log channel could not be found."
                );

                return;
            }

            const message = await channel.messages
                .fetch(STATUS_MESSAGE_ID)
                .catch(() => null);

            if (!message) {
                console.log(
                    "⚠️ GameLog status message could not be found."
                );

                return;
            }

            const embed =
                new EmbedBuilder()
                    .setColor(0x22c55e)
                    .setTitle("🟢 GameLog")
                    .setDescription(
                        "GameLog is currently online and running."
                    )
                    .addFields(
                        {
                            name: "Version",
                            value: `v${packageJson.version}`,
                            inline: true
                        },
                        {
                            name: "Servers",
                            value: `${client.guilds.cache.size}`,
                            inline: true
                        },
                        {
                            name: "Commands",
                            value: `${client.commands.size}`,
                            inline: true
                        },
                        {
                            name: "Status",
                            value: "🟢 Online",
                            inline: true
                        },
                        {
                            name: "Last Restart",
                            value: `<t:${Math.floor(Date.now() / 1000)}:F>`,
                            inline: false
                        }
                    )
                    .setTimestamp()
                    .setFooter({
                        text: "GameLog • Bot Status"
                    });

            await message.edit({
                content: "🎮 **GAMELOG STATUS**",
                embeds: [embed]
            });

            console.log(
                `📌 Updated GameLog status message: ${STATUS_MESSAGE_ID}`
            );

            // Check for a new release
            await updateBotStatus(client, message);

        } catch (error) {
            console.error(
                "❌ Failed to update GameLog status:",
                error
            );
        }
    }
};