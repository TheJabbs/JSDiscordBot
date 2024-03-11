// const { EmbedBuilder } = require('discord.js');
// require('dotenv').config();

// function aboutCommand(message) {
//     const embed = new EmbedBuilder()
//         .setTitle("About This Bot")
//         .setDescription("Auto Purge Bot Made By Paraformaldead#7571")
//         .setColor(0x0099ff)
//         .setAuthor({
//             name: message.author.tag,
//             iconURL: message.author.displayAvatarURL({ dynamic: true }),
//         })
//         .addFields(
//             { name: 'Bot Name', value: 'StopOil Auto_Purger', inline: true },
//             { name: 'Version', value: '1.0.0', inline: true },
//             { name: 'Creator', value: 'Paraformaldead#7571' },
//             { name: 'Description', value: 'Bot to purge you all dirty ass messages' },
//             { name: 'Support', value: 'paraformaldead@gmail.com / Paraformaldead#7571' }
//         )
//         .setFooter({
//             text: process.env.AUTHOR + " | " + new Date().toLocaleDateString(),
//         })
//         .setTimestamp();

//     message.channel.send({ embeds: [embed] });
// }

// module.exports = aboutCommand;

const { EmbedBuilder } = require('discord.js');
require('dotenv').config();

function aboutCommand(message) {
    const embed = new EmbedBuilder()
        .setTitle("About " + message.client.user.username)
        .setDescription("Bot to purge all your dirty-ass messages and keep your channels clean!")
        .setColor(0x1ABC9C)
        .setThumbnail(message.client.user.displayAvatarURL({ dynamic: true }))
        .setAuthor({
            name: message.client.user.username,
            iconURL: message.client.user.displayAvatarURL({ dynamic: true }),
        })
        .addFields(
            { name: 'Bot Name', value: message.client.user.username, inline: true },
            { name: 'Version', value: '1.0.0', inline: true },
            { name: 'Creator', value: 'Paraformaldead#7571' },
            { name: 'Description', value: 'Automatically purges messages to maintain tidiness in your Discord channels.' },
            {
                name: 'Support',
                value: `📧 paraformaldead@gmail.com\n` +
                    `💬 Paraformaldead#7571\n` +
                    `🔗 [Discord](https://discord.gg/2gMnp5PD)\n` +
                    `📱 [Telegram](https://t.me/Paraformaldead)`
            })
        .setFooter({
            text: "Developed by " + process.env.AUTHOR,
            iconURL: message.client.user.displayAvatarURL({ dynamic: true })
        })
        .setTimestamp();

    message.channel.send({ embeds: [embed] });
}

module.exports = aboutCommand;
