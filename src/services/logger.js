const {
    EmbedBuilder
} = require("discord.js");

const db = require("../database/database");

// ================================
// GAMELOG CHANNELS
// ================================

const LOG_CHANNELS = {
    member: "1551696477338861568",
    message: "1551696478467137566",
    moderation: "1551696479289085954",
    server: "1551696480757358652",
    bot: "1551696481965178940"
};

// ================================
// SEND LOG
// ================================

async function sendLog(guild, type, data = {}) {
    try {
        const channelMap = {
            memberJoin: LOG_CHANNELS.member,
            memberLeave: LOG_CHANNELS.member,

            messageDelete: LOG_CHANNELS.message,
            messageUpdate: LOG_CHANNELS.message,

            memberBan: LOG_CHANNELS.moderation,
            memberUnban: LOG_CHANNELS.moderation,
            memberTimeout: LOG_CHANNELS.moderation,
            memberTimeoutRemove: LOG_CHANNELS.moderation,

            moderation: LOG_CHANNELS.moderation,

            server: LOG_CHANNELS.server,

            bot: LOG_CHANNELS.bot
        };

        const channelId = channelMap[type];

        if (!channelId) return;

        const channel = guild.channels.cache.get(channelId);

        if (!channel || !channel.isTextBased()) {
            console.log(
                `⚠️ GameLog could not find log channel ${channelId}`
            );
            return;
        }

        const embed = new EmbedBuilder()
            .setTimestamp()
            .setFooter({
                text: "GameLog • Server Logs"
            });

        switch (type) {

            case "memberJoin":
                embed
                    .setColor(0x22c55e)
                    .setTitle("📥 Member Joined")
                    .setDescription(
                        `${data.user} joined the server.`
                    )
                    .addFields({
                        name: "User",
                        value:
                            `${data.user.tag}\n` +
                            `\`${data.user.id}\``
                    });
                break;

            case "memberLeave":
                embed
                    .setColor(0xef4444)
                    .setTitle("📤 Member Left")
                    .setDescription(
                        `${data.user.tag} left the server.`
                    )
                    .addFields({
                        name: "User ID",
                        value: `\`${data.user.id}\``
                    });
                break;

            case "messageDelete":
                embed
                    .setColor(0xef4444)
                    .setTitle("🗑️ Message Deleted")
                    .addFields(
                        {
                            name: "User",
                            value:
                                data.author
                                    ? `${data.author.tag}\n\`${data.author.id}\``
                                    : "Unknown"
                        },
                        {
                            name: "Channel",
                            value: `${data.channel}`
                        },
                        {
                            name: "Message",
                            value:
                                data.content
                                    ? data.content.slice(0, 1024)
                                    : "No message content available."
                        }
                    );
                break;

            case "messageUpdate":
                embed
                    .setColor(0xf59e0b)
                    .setTitle("✏️ Message Edited")
                    .addFields(
                        {
                            name: "User",
                            value:
                                data.author
                                    ? `${data.author.tag}\n\`${data.author.id}\``
                                    : "Unknown"
                        },
                        {
                            name: "Channel",
                            value: `${data.channel}`
                        },
                        {
                            name: "Before",
                            value:
                                data.oldContent
                                    ? data.oldContent.slice(0, 1024)
                                    : "Unknown"
                        },
                        {
                            name: "After",
                            value:
                                data.newContent
                                    ? data.newContent.slice(0, 1024)
                                    : "Unknown"
                        }
                    );
                break;

            case "memberBan":
                embed
                    .setColor(0xef4444)
                    .setTitle("🔨 Member Banned")
                    .setDescription(
                        `${data.user} was banned from the server.`
                    )
                    .addFields(
                        {
                            name: "User",
                            value:
                                `${data.user.tag}\n` +
                                `\`${data.user.id}\``
                        },
                        {
                            name: "Moderator",
                            value:
                                data.moderator
                                    ? `${data.moderator}`
                                    : "Unknown"
                        },
                        {
                            name: "Reason",
                            value:
                                data.reason ||
                                "No reason provided."
                        }
                    );
                break;

            case "memberUnban":
                embed
                    .setColor(0x22c55e)
                    .setTitle("🔓 Member Unbanned")
                    .setDescription(
                        `${data.user.tag} was unbanned.`
                    )
                    .addFields(
                        {
                            name: "User ID",
                            value: `\`${data.user.id}\``
                        },
                        {
                            name: "Moderator",
                            value:
                                data.moderator
                                    ? `${data.moderator}`
                                    : "Unknown"
                        }
                    );
                break;

            case "memberTimeout":
                embed
                    .setColor(0xf59e0b)
                    .setTitle("⏰ Member Timed Out")
                    .setDescription(
                        `${data.user} was timed out.`
                    )
                    .addFields(
                        {
                            name: "User",
                            value:
                                `${data.user.tag}\n` +
                                `\`${data.user.id}\``
                        },
                        {
                            name: "Moderator",
                            value:
                                data.moderator
                                    ? `${data.moderator}`
                                    : "Unknown"
                        },
                        {
                            name: "Duration",
                            value:
                                data.duration ||
                                "Unknown"
                        },
                        {
                            name: "Reason",
                            value:
                                data.reason ||
                                "No reason provided."
                        }
                    );
                break;

            case "memberTimeoutRemove":
                embed
                    .setColor(0x22c55e)
                    .setTitle("🔓 Timeout Removed")
                    .setDescription(
                        `${data.user} is no longer timed out.`
                    )
                    .addFields(
                        {
                            name: "User",
                            value:
                                `${data.user.tag}\n` +
                                `\`${data.user.id}\``
                        },
                        {
                            name: "Moderator",
                            value:
                                data.moderator
                                    ? `${data.moderator}`
                                    : "Unknown"
                        }
                    );
                break;

            default:
                return;
        }

        await channel.send({
            embeds: [embed]
        });

    } catch (error) {
        console.error("❌ Logging error:", error);
    }
}

module.exports = {
    sendLog
};