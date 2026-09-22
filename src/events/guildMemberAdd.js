const { sendLog } = require("../services/logger");

module.exports = {
    name: "guildMemberAdd",

    async execute(member) {
        await sendLog(member.guild, "memberJoin", {
            user: member.user
        });
    }
};