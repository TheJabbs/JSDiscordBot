const { EmbedBuilder } = require('discord.js');

function sendNotAllowedEmbed(message) {
    const embed = new EmbedBuilder()
        .setTitle("Guild Not Authorized")
        .setDescription("Commands for this bot are not allowed in this server.")
        .setColor(0xff0000) 
        .addFields({
            name: 'Support',
            value: `📧 paraformaldead@gmail.com\n` +
                   `💬 Paraformaldead#7571\n` +
                   `🔗 [Discord](https://discord.gg/2gMnp5PD)\n` +
                   `📱 [Telegram](https://t.me/Paraformaldead)`
        })
        .setFooter({
            text: 'Please contact support for more information.'
        })
        .setTimestamp();

    message.channel.send({ embeds: [embed] });
}

module.exports = sendNotAllowedEmbed;