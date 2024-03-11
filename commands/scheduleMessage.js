const { EmbedBuilder } = require('discord.js');
const { readSettings, writeSettings } = require('../utilities/IOHandler');
const path = require('path');
const ms = require('ms'); 

function generateUniqueId() {
    const idFilename = path.join(__dirname, process.env.PATH_lastMessageId);
    const lastIdData = readSettings(idFilename);
    let lastUsedId = lastIdData.lastUsedId || 0;

    lastUsedId += 1;
    writeSettings(idFilename, { lastUsedId: lastUsedId });
    return lastUsedId;
}

function getNextSendTime(timeInput) {
    const [hours, minutes] = timeInput.split(':').map(Number);
    const now = new Date();
    const nextSend = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0, 0);

    if (nextSend < now) {
        nextSend.setDate(nextSend.getDate() + 1);
    }

    return nextSend;
}

async function scheduleMessageCommand(client, message, args) {
    if (args.length < 3) {
        const errorEmbed = new EmbedBuilder()
            .setColor(0xFF0000)
            .setTitle('Invalid Command Usage')
            .setDescription('**Usage:** !schedualmessage <channel_id> <HH:MM> <message>')
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

    const channelId = args[0];
    const timeInput = args[1]; 
    const scheduledMessageContent = args.slice(2).join(" ");

    let targetChannel;
    try {
        targetChannel = await client.channels.fetch(channelId);
    } catch (error) {
        message.channel.send("Invalid channel ID.");
        return;
    }

    const nextSendTime = getNextSendTime(timeInput);
    const delay = nextSendTime.getTime() - Date.now();
    const delayInHours = ms(delay, { long: true });

    const messageId = generateUniqueId();
    const scheduleFilename = path.join(__dirname, process.env.PATH_scheduledMessages);
    const schedule = readSettings(scheduleFilename);

    if (!schedule[channelId]) {
        schedule[channelId] = [];
    }

    schedule[channelId].push({
        id: messageId,
        time: timeInput,
        message: scheduledMessageContent,
        nextSendTime: nextSendTime.toISOString()
    });
    writeSettings(scheduleFilename, schedule);

    message.channel.send(`Message with ID ${messageId} scheduled to be sent to <#${channelId}> daily at ${timeInput}.`);

    scheduleNewMessage(client, channelId, messageId, scheduledMessageContent, delay, scheduleFilename);
}

function scheduleNewMessage(client, channelId, messageId, message, delay, scheduleFilename) {
    setTimeout(async () => {
        sendScheduledMessage(client, channelId, message);

        const interval = setInterval(() => {
            sendScheduledMessage(client, channelId, message);
        }, 24 * 60 * 60 * 1000); 
        client.messageIntervals = client.messageIntervals || {};
        client.messageIntervals[`${channelId}-${messageId}`] = interval;
    }, delay);
}

async function sendScheduledMessage(client, channelId, message) {
    try {
        const channel = await client.channels.fetch(channelId);
        await channel.send(message);
    } catch (error) {
        console.error(`Failed to send message to channel ${channelId}: ${error}`);
    }
}

module.exports = {scheduleMessageCommand, sendScheduledMessage};
