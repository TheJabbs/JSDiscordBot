const { EmbedBuilder } = require('discord.js');
const { readSettings, writeSettings } = require('../utilities/IOHandler');
const path = require('path');

function removeScheduledMessageCommand(client, message, args) {
    if (args.length !== 1) {
        const errorEmbed = new EmbedBuilder()
            .setColor(0xFF0000)
            .setTitle('Invalid Command Usage')
            .setDescription('**Usage:** !removescheduledmessage <message_id>')
            .setAuthor({
                name: message.author.tag,
                iconURL: message.author.displayAvatarURL({ dynamic: true }),
            })
            .setFooter({
                text: process.env.AUTHOR + " | " + new Date().toLocaleDateString(),
            })
            .setTimestamp();

        message.channel.send({ embeds: [errorEmbed] });
        return;
    }
    const messageId = parseInt(args[0]);
    if (isNaN(messageId)) {
        return message.channel.send("Please provide a valid message ID (numeric value).");
    }

    const scheduleFilename = path.join(__dirname, process.env.PATH_scheduledMessages);
    const schedule = readSettings(scheduleFilename);
    let messageFound = false;

    for (const channelId in schedule) {
        const index = schedule[channelId].findIndex(item => item.id === messageId);
        if (index !== -1) {
            schedule[channelId].splice(index, 1);
            messageFound = true;
            break;
        }
    }

    if (!messageFound) {
        return message.channel.send(`No scheduled message found with ID: ${messageId}`);
    }

    writeSettings(scheduleFilename, schedule);
    message.channel.send(`Scheduled message with ID ${messageId} has been removed.`);
}

module.exports = removeScheduledMessageCommand;
