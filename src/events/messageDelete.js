const { sendLog } = require("../services/logger");

module.exports = {
    name: "messageDelete",

    async execute(message) {
        if (!message.guild) return;

        await sendLog(message.guild, "messageDelete", {
            author: message.author,
            channel: message.channel,
            content: message.content
        });
    }
};