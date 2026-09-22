const {
    AuditLogEvent
} = require("discord.js");

const { sendLog } = require("../services/logger");

module.exports = {
    name: "guildBanAdd",

    async execute(ban) {
        let moderator = null;
        let reason = null;

        try {
            await new Promise(resolve =>
                setTimeout(resolve, 1000)
            );

            const logs = await ban.guild.fetchAuditLogs({
                type: AuditLogEvent.MemberBanAdd,
                limit: 5
            });

            const entry = logs.entries.find(
                entry =>
                    entry.target &&
                    entry.target.id === ban.user.id
            );

            if (entry) {
                moderator = entry.executor;
                reason = entry.reason;
            }
        } catch (error) {
            console.error(
                "❌ Ban audit log error:",
                error
            );
        }

        await sendLog(
            ban.guild,
            "memberBan",
            {
                user: ban.user,
                moderator,
                reason
            }
        );
    }
};