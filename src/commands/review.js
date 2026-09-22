const {
    SlashCommandBuilder
} = require("discord.js");

const REVIEW_CHANNEL_ID = "1548148392688099408";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("review")
        .setDescription("Leave a review for a TGN staff member.")

        .addUserOption(option =>
            option
                .setName("staff")
                .setDescription("Choose the staff member you received service from.")
                .setRequired(true)
        )

        .addStringOption(option =>
            option
                .setName("service")
                .setDescription("Choose the service you received.")
                .setRequired(true)
                .addChoices(
                    { name: "Ad Posting", value: "Ad Posting" },
                    { name: "Server Bumping", value: "Server Bumping" },
                    { name: "Server Custom", value: "Server Custom" },
                    { name: "Graphics", value: "Graphics" },
                    { name: "Other", value: "Other" }
                )
        )

        .addIntegerOption(option =>
            option
                .setName("rating")
                .setDescription("Choose your rating from 1 to 10.")
                .setRequired(true)
                .addChoices(
                    { name: "1/10 ⭐", value: 1 },
                    { name: "2/10 ⭐⭐", value: 2 },
                    { name: "3/10 ⭐⭐⭐", value: 3 },
                    { name: "4/10 ⭐⭐⭐⭐", value: 4 },
                    { name: "5/10 ⭐⭐⭐⭐⭐", value: 5 },
                    { name: "6/10 ⭐⭐⭐⭐⭐⭐", value: 6 },
                    { name: "7/10 ⭐⭐⭐⭐⭐⭐⭐", value: 7 },
                    { name: "8/10 ⭐⭐⭐⭐⭐⭐⭐⭐", value: 8 },
                    { name: "9/10 ⭐⭐⭐⭐⭐⭐⭐⭐⭐", value: 9 },
                    { name: "10/10 ⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐", value: 10 }
                )
        )

        .addStringOption(option =>
            option
                .setName("reason")
                .setDescription("Explain why you gave this rating.")
                .setRequired(true)
                .setMaxLength(1000)
        ),

    async execute(interaction) {
        const staff = interaction.options.getUser("staff");
        const service = interaction.options.getString("service");
        const rating = interaction.options.getInteger("rating");
        const reason = interaction.options.getString("reason");

        const reviewChannel =
            interaction.guild.channels.cache.get(REVIEW_CHANNEL_ID);

        if (!reviewChannel) {
            return interaction.reply({
                content: "❌ The review channel could not be found.",
                ephemeral: true
            });
        }

   const message =
    `<:GreenNeonStars:1548371784435245106> **Service Review**\n\n` +
    `<:GreenArrowRight:1548371593678422047> **User**: ${interaction.user}\n` +
    `<:GreenArrowRight:1548371593678422047> **Staff Member**: ${staff}\n` +
    `<:GreenArrowRight:1548371593678422047> **Service**: ${service}\n` +
    `<:GreenArrowRight:1548371593678422047> **Rating (1-10)**: ${rating}/10\n` +
    `<:GreenArrowRight:1548371593678422047> **Reason For Rating**: ${reason}`;

        await reviewChannel.send({
            content: message
        });

        await interaction.reply({
            content: "✅ Your review has been submitted!",
            ephemeral: true
        });
    }
};