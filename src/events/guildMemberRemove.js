const { sendLog } = require("../services/logger");

module.exports = {
    name: "guildMemberRemove",

    async execute(member) {
        await sendLog(member.guild, "memberLeave", {
            user: member.user
        });
    }
};