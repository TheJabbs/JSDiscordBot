const { setupAutoPurge } = require('../utilities/setupAutoPurge');
const { readSettings, writeSettings } = require('../utilities/IOHandler');
const path = require('path');

function setAutoPurgeCommand(client, message, args) {
    if (!client) {
        console.error("Client object is not available.");
        return;
    }

    if (message && (!message.channel || typeof message.channel.send !== 'function')) {
        console.error("Invalid message or channel object.");
        return;
    }

    if (!args || args.length % 2 !== 0) {
        message?.channel.send({ content: "Invalid command usage. Please provide pairs of channel IDs and timers." });
        return;
    }

    const settingsPath = path.join(__dirname, process.env.PATH_autoClearSettings);
    const settings = readSettings(settingsPath);

    for (let i = 0; i < args.length; i += 2) {
        const channelId = args[i];
        const timeInSeconds = parseInt(args[i + 1]);
        const channel = client.channels.cache.get(channelId);

        if (!channel) {
            console.error(`Channel with ID ${channelId} not found.`);
            continue;
        }

        setupAutoPurge(client, channel, timeInSeconds);
        settings[channelId] = timeInSeconds;
    }

    writeSettings(settingsPath, settings);
    if (message) {
        message.channel.send({ content: "Auto purge settings updated." });
    }
}

module.exports = setAutoPurgeCommand;
