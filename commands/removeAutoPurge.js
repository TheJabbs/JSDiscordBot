const { EmbedBuilder } = require('discord.js');
const { readSettings, writeSettings } = require('../utilities/IOHandler');
require('dotenv').config();
const path = require('path');

function removeAutoPurgeCommand(client, message, args) {
    if (args.length !== 1) {
        const errorEmbed = new EmbedBuilder()
            .setColor(0xFF0000)
            .setTitle('Invalid Command Usage')
            .setDescription('**Usage:**')
            .addFields(
                { name: '!removeautopurge [Channel ID]', value: 'Removes auto-purge for a specified channel.' },
            )
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
    const settingsPath = path.join(__dirname, process.env.PATH_autoClearSettings);
    const settings = readSettings(settingsPath);

    if (settings[channelId]) {
        delete settings[channelId];
        writeSettings(settingsPath, settings);

        const successEmbed = new EmbedBuilder()
            .setColor(0x00FF00)
            .setTitle('Auto Purge Removed')
            .setDescription(`Auto purge removed for channel <#${channelId}>.`)
            .setAuthor({
                name: message.author.tag,
                iconURL: message.author.displayAvatarURL({ dynamic: true }),
            })
            .setFooter({
                text: process.env.AUTHOR + " | " + new Date().toLocaleDateString(),
            })
            .setTimestamp();
        message.channel.send({ embeds: [successEmbed] });

        if (client.autoPurgeSettings.has(channelId)) {
            clearInterval(client.autoPurgeSettings.get(channelId));
            client.autoPurgeSettings.delete(channelId);
        }
    } else {
        const infoEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('No Setting Found')
            .setDescription(`No auto purge setting found for channel <#${channelId}>.`)
            .setAuthor({
                name: message.author.tag,
                iconURL: message.author.displayAvatarURL({ dynamic: true }),
            })
            .setFooter({
                text: process.env.AUTHOR + " | " + new Date().toLocaleDateString(),
            })
            .setTimestamp();
        message.channel.send({ embeds: [infoEmbed] });
    }
}

module.exports = removeAutoPurgeCommand;