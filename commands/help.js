const { EmbedBuilder } = require('discord.js');
require('dotenv').config();
const prefix = process.env.BOT_PREFIX;

function helpCommand(message) {
    const embed = new EmbedBuilder()
        .setTitle("Help - List of Commands")
        .setColor(0x0099ff)
        .setDescription("Here are the available commands:")
        .addFields([
            {
                name: `**🗑️ Purge Commands**`,
                value: `**\`${prefix}purge\`** [Number] - Delete messages in bulk.\n`,
                inline: false
            },
            {
                name: `**🔄 Auto-Purge Commands**`,
                value: `**\`${prefix}setautopurge\`** [Channel ID] [Sec] - Start auto-purge.\n` +
                    `**\`${prefix}showautopurge\`** - List auto-purge settings.\n` +
                    `**\`${prefix}removeautopurge\`** [Channel ID] - Remove auto-purge.`,
                inline: false
            },
            {
                name: `**📅 Message Scheduling Commands**`,
                value: `**\`${prefix}schedulemessage\`** [Channel ID] [UTC time] [Message] - Schedule a message.\n` +
                    `**\`${prefix}showscheduledmessages\`** - Show scheduled messages.\n` +
                    `**\`${prefix}removescheduledmessage\`** [Message ID] - Cancel a message.`,
                inline: false
            },
            {
                name: `**ℹ General Commands**`,
                value: `**\`${prefix}about\`** - Show bot details.\n` +
                    `**\`${prefix}help\`** - Display help info.`,
                inline: false
            }
        ])
        .setAuthor({
            name: message.author.tag,
            iconURL: message.author.displayAvatarURL({ dynamic: true }),
        })
        .setFooter({
            text: process.env.AUTHOR + " | " + new Date().toLocaleDateString(),
        })
        .setTimestamp();

    message.channel.send({ embeds: [embed] });
}

module.exports = helpCommand;
