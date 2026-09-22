const {
    EmbedBuilder,
    AttachmentBuilder
} = require("discord.js");

const fs = require("fs");
const path = require("path");

const packageJson = require("../../package.json");

const projectRoot = path.join(__dirname, "../..");

const changelogPath = path.join(
    projectRoot,
    "CHANGELOG.md"
);

const readmePath = path.join(
    projectRoot,
    "README.md"
);

const stateFolder = path.join(
    projectRoot,
    "database"
);

const statePath = path.join(
    stateFolder,
    "release-state.json"
);

// ================================
// GET LAST VERSION
// ================================

function getLastAnnouncedVersion() {
    try {
        if (!fs.existsSync(statePath)) {
            return null;
        }

        const data = JSON.parse(
            fs.readFileSync(statePath, "utf8")
        );

        return data.version || null;

    } catch (error) {
        console.error(
            "❌ Failed to read release state:",
            error
        );

        return null;
    }
}

// ================================
// SAVE VERSION
// ================================

function saveAnnouncedVersion(version) {
    try {
        if (!fs.existsSync(stateFolder)) {
            fs.mkdirSync(stateFolder, {
                recursive: true
            });
        }

        fs.writeFileSync(
            statePath,
            JSON.stringify(
                {
                    version
                },
                null,
                4
            )
        );

    } catch (error) {
        console.error(
            "❌ Failed to save release state:",
            error
        );
    }
}

// ================================
// GET CHANGELOG
// ================================

function getChangelogForVersion(version) {
    try {
        if (!fs.existsSync(changelogPath)) {
            return "No changelog was found.";
        }

        const changelog =
            fs.readFileSync(
                changelogPath,
                "utf8"
            );

        const lines =
            changelog.split(/\r?\n/);

        const escapedVersion =
            version.replace(
                /[.*+?^${}()|[\]\\]/g,
                "\\$&"
            );

        const versionPattern =
            new RegExp(
                `^#{1,6}\\s*v?${escapedVersion}\\s*$`,
                "i"
            );

        const startIndex =
            lines.findIndex(line =>
                versionPattern.test(
                    line.trim()
                )
            );

        if (startIndex === -1) {
            return `No changelog entry was found for v${version}.`;
        }

        const section = [];

        for (
            let i = startIndex;
            i < lines.length;
            i++
        ) {
            if (
                i > startIndex &&
                /^#{1,6}\s*v?\d+\.\d+\.\d+/i.test(
                    lines[i].trim()
                )
            ) {
                break;
            }

            section.push(lines[i]);
        }

        return (
            section.join("\n").trim() ||
            `No changelog entry was found for v${version}.`
        );

    } catch (error) {
        console.error(
            "❌ Failed to read changelog:",
            error
        );

        return "Unable to read the changelog.";
    }
}

// ================================
// UPDATE STATUS MESSAGE
// ================================

async function updateBotStatus(client, message) {
    try {
        const currentVersion =
            packageJson.version;

        const lastVersion =
            getLastAnnouncedVersion();

        // First startup
        if (!lastVersion) {
            saveAnnouncedVersion(
                currentVersion
            );

            console.log(
                `📌 Saved initial GameLog version: v${currentVersion}`
            );

            return;
        }

        // No new version
        if (
            lastVersion ===
            currentVersion
        ) {
            return;
        }

        const changelog =
            getChangelogForVersion(
                currentVersion
            );

        const files = [];

        if (
            fs.existsSync(
                changelogPath
            )
        ) {
            files.push(
                new AttachmentBuilder(
                    changelogPath,
                    {
                        name:
                            "CHANGELOG.md"
                    }
                )
            );
        }

        if (
            fs.existsSync(
                readmePath
            )
        ) {
            files.push(
                new AttachmentBuilder(
                    readmePath,
                    {
                        name:
                            "README.md"
                    }
                )
            );
        }

        const embed =
            new EmbedBuilder()
                .setColor(0x8b5cf6)
                .setTitle(
                    `🚀 GameLog v${currentVersion}`
                )
                .setDescription(
                    "A new version of GameLog has been released!"
                )
                .addFields(
                    {
                        name:
                            "📋 What's New",
                        value:
                            changelog.length > 4000
                                ? changelog.slice(
                                      0,
                                      3997
                                  ) + "..."
                                : changelog
                    },
                    {
                        name:
                            "🌐 Servers",
                        value:
                            `${client.guilds.cache.size}`,
                        inline: true
                    },
                    {
                        name:
                            "🎮 Commands",
                        value:
                            `${client.commands.size}`,
                        inline: true
                    },
                    {
                        name:
                            "🟢 Status",
                        value:
                            "Online",
                        inline: true
                    }
                )
                .setTimestamp()
                .setFooter({
                    text:
                        "GameLog • Latest Release"
                });

        await message.edit({
            content:
                `🚀 **GAMELOG v${currentVersion}**`,
            embeds: [embed],
            files
        });

        saveAnnouncedVersion(
            currentVersion
        );

        console.log(
            `🚀 Updated GameLog release message to v${currentVersion}`
        );

    } catch (error) {
        console.error(
            "❌ Failed to update GameLog status:",
            error
        );
    }
}

// ================================
// EXPORT
// ================================

module.exports = {
    updateBotStatus
};