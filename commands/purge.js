const { EmbedBuilder } = require('discord.js');

async function purgeCommand(message, args) {
    const deleteCount = parseInt(args[0], 10);
    
    if (!deleteCount || deleteCount < 1 || deleteCount > 100) {
        return message.channel.send("Please provide a number between 1 and 100 for the number of messages to delete.");
    }

    try {
        const fetchedMessages = await message.channel.messages.fetch({ limit: deleteCount + 1 });
        const nonPinnedMessages = fetchedMessages.filter(fetchedMsg => !fetchedMsg.pinned);

        await message.channel.bulkDelete(nonPinnedMessages, true);
        message.channel.send(`Successfully deleted ${nonPinnedMessages.size} messages.`)
            .then(msg => {
                setTimeout(() => msg.delete(), 5000); 
            });
    } catch (error) {
        console.error('Error trying to delete messages:', error);
        message.channel.send("There was an error trying to delete messages in this channel!");
    }
}

module.exports = purgeCommand;