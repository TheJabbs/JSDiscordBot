const { EmbedBuilder } = require('discord.js');
const { readSettings } = require('../utilities/IOHandler');
require('dotenv').config();
const path = require('path');

function showAutoPurgeCommand(message) {
    const settingsPath = path.join(__dirname, process.env.PATH_autoClearSettings);
    const settings = readSettings(settingsPath);

    const embed = new EmbedBuilder()
        .setTitle("🔧 Scheduled Auto-Purge Channels")
        .setColor(0x0099ff)
        .setFooter({
            text: process.env.AUTHOR + " | " + new Date().toLocaleDateString(),
        })
        .setTimestamp();

    if (Object.keys(settings).length === 0) {
        embed.setDescription("ℹ️ No channels are currently set for auto-purge.");
    } else {
        embed.setDescription(
            "📄 Here are the channels with their respective auto-purge intervals:"
        );
        for (const [channelId, timeInSeconds] of Object.entries(settings)) {
            embed.addFields({
                name: `📢 Channel: <#${channelId}>`,
                value: `⏲️ Purge every \`${timeInSeconds}\` seconds\n`,
                inline: false,
            });
        }
    }

    message.channel.send({ embeds: [embed] });
}

module.exports = showAutoPurgeCommand;
