
const { EmbedBuilder } = require("discord.js");
function setupAutoPurge(client, channelId, timeInSeconds) {
    channelId = String(channelId).replace(/<#|>/g, '');

    if (client.autoPurgeSettings.has(channelId)) {
        clearInterval(autoPurgeSettings.get(channelId));
    }

    const interval = setInterval(async () => {
        try {
            const channel = await client.channels.fetch(channelId);
            if (channel) {
                let totalPurged = 0;
                let fetched;
                do {
                    fetched = await channel.messages.fetch({ limit: 100 });
                    const notPinned = fetched.filter((msg) => !msg.pinned);
                    totalPurged += notPinned.size;
                    await channel.bulkDelete(notPinned, true).catch((err) => {
                        console.error(err);
                        return;
                    });
                } while (fetched.size >= 100);

                if (totalPurged > 0) {
                    const nextPurgeTime = new Date(Date.now() + timeInSeconds * 1000);
                    const purgeEmbed = new EmbedBuilder()
                        .setColor(0x3498DB)
                        .setTitle("Auto Purge Completed")
                        .setDescription(`Total messages purged: ${totalPurged}`)
                        .addFields({ name: "Next Purge Time", value: nextPurgeTime.toLocaleString(), inline: false })
                        .setFooter({
                            text: process.env.AUTHOR + " | " + new Date().toLocaleDateString(),
                        })
                        .setTimestamp();

                    await channel.send({ embeds: [purgeEmbed] });
                }
            }
        } catch (error) {
            console.error(`Error during auto-clear in channel ${channelId}: ${error}`);
        }
    }, timeInSeconds * 1000);

    client.autoPurgeSettings.set(channelId, interval);
}

module.exports = { setupAutoPurge };
