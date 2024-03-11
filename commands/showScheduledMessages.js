const { EmbedBuilder } = require('discord.js');
const { readSettings } = require('../utilities/IOHandler');
const path = require('path');

function showScheduledMessagesCommand(message) {
    const scheduleFilename = path.join(__dirname, process.env.PATH_scheduledMessages);
    const schedule = readSettings(scheduleFilename);

    const embed = new EmbedBuilder()
        .setTitle("Scheduled Messages")
        .setColor(0x0099ff)
        .setAuthor({
            name: message.author.tag,
            iconURL: message.author.displayAvatarURL({ dynamic: true }),
        })
        .setFooter({
            text: process.env.AUTHOR + " | " + new Date().toLocaleDateString(),
        })
        .setTimestamp();

    if (Object.keys(schedule).length === 0) {
        embed.setDescription("ℹ️ There are currently no scheduled messages.");
    } else {
        embed.setDescription("📄 Here are the scheduled messages with their respective channels and times:");
        Object.entries(schedule).forEach(([channelId, messages]) => {
            messages.forEach((msg, index) => {
                embed.addFields({
                    name: `Channel <#${channelId}> - Message ${index + 1}`,
                    value: `🆔 Message ID: ${msg.id}\n ⏲️ Time: ${msg.time}\n📝 Message: "${msg.message}"`,
                    inline: false,
                });
            });
        });
    }

    message.channel.send({ embeds: [embed] });
}

module.exports = showScheduledMessagesCommand;