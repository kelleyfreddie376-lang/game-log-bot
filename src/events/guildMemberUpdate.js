const {
    AuditLogEvent
} = require("discord.js");

const { sendLog } = require("../services/logger");

module.exports = {
    name: "guildMemberUpdate",

    async execute(oldMember, newMember) {
        const oldTimeout = oldMember.communicationDisabledUntilTimestamp;
        const newTimeout = newMember.communicationDisabledUntilTimestamp;

        if (oldTimeout === newTimeout) return;

        let moderator = null;
        let reason = null;

        try {
            const logs = await newMember.guild.fetchAuditLogs({
                type: AuditLogEvent.MemberUpdate,
                limit: 5
            });

            const entry = logs.entries.find(
                entry =>
                    entry.target &&
                    entry.target.id === newMember.id
            );

            if (entry) {
                moderator = entry.executor;
                reason = entry.reason;
            }
        } catch (error) {
            console.error(
                "❌ Failed to fetch timeout audit log:",
                error
            );
        }

        if (newTimeout) {
            const duration =
                Math.max(
                    0,
                    newTimeout - Date.now()
                );

            const minutes = Math.ceil(
                duration / 60000
            );

            await sendLog(
                newMember.guild,
                "memberTimeout",
                {
                    user: newMember.user,
                    moderator,
                    reason,
                    duration: `${minutes} minute(s)`
                }
            );
        } else {
            await sendLog(
                newMember.guild,
                "memberTimeoutRemove",
                {
                    user: newMember.user,
                    moderator
                }
            );
        }
    }
};