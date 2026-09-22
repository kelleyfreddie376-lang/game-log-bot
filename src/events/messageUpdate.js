const { sendLog } = require("../services/logger");

module.exports = {
    name: "messageUpdate",

    async execute(oldMessage, newMessage) {
        if (!newMessage.guild) return;

        if (oldMessage.content === newMessage.content) return;

        await sendLog(newMessage.guild, "messageUpdate", {
            author: newMessage.author,
            channel: newMessage.channel,
            oldContent: oldMessage.content,
            newContent: newMessage.content
        });
    }
};