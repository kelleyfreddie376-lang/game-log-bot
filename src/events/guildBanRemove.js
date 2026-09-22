const {
    AuditLogEvent
} = require("discord.js");

const { sendLog } = require("../services/logger");

module.exports = {
    name: "guildBanRemove",

    async execute(ban) {
        let moderator = null;

        try {
            await new Promise(resolve =>
                setTimeout(resolve, 1000)
            );

            const logs = await ban.guild.fetchAuditLogs({
                type: AuditLogEvent.MemberBanRemove,
                limit: 5
            });

            const entry = logs.entries.find(
                entry =>
                    entry.target &&
                    entry.target.id === ban.user.id
            );

            if (entry) {
                moderator = entry.executor;
            }
        } catch (error) {
            console.error(
                "❌ Unban audit log error:",
                error
            );
        }

        await sendLog(
            ban.guild,
            "memberUnban",
            {
                user: ban.user,
                moderator
            }
        );
    }
};