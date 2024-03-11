const { Client, GatewayIntentBits, PermissionsBitField, EmbedBuilder } = require("discord.js");
const setAutoPurgeCommand = require('./commands/setAutoPurge');
const showAutoPurgeCommand = require('./commands/showAutoPurge');
const removeAutoPurgeCommand = require('./commands/removeAutoPurge');
const { scheduleMessageCommand, sendScheduledMessage } = require('./commands/scheduleMessage');
const showScheduledMessagesCommand = require('./commands/showScheduledMessages');
const removeScheduledMessageCommand = require('./commands/removeScheduledMessage');
const sendNotAllowedEmbed = require('./utilities/restrictedGuild');
const purgeCommand = require('./commands/purge');
const aboutCommand = require('./commands/about');
const helpCommand = require('./commands/help');
const { readSettings } = require('./utilities/IOHandler');
const path = require('path');
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
  ],
});

client.autoPurgeSettings = new Map();
client.messageIntervals = new Map();


client.once("ready", () => {
  console.log("Bot is online!");

  client.guilds.cache.forEach(guild => {
    console.log(`Currently in guild: ${guild.name} (id: ${guild.id})`);
  });

  const settings = readSettings();
  Object.entries(settings).forEach(([channelId, timeInSeconds]) => {
    setAutoPurgeCommand(client, null, [channelId, timeInSeconds.toString()]);
  });

  initializeScheduledMessages();

});

function initializeScheduledMessages() {
  const schedule = readSettings(path.join(__dirname, '../Storage/scheduledMessages.json'));
  for (const channelId in schedule) {
    schedule[channelId].forEach(scheduledItem => {
      const now = new Date();
      const scheduledTimeToday = new Date(now);
      scheduledTimeToday.setHours(...scheduledItem.time.split(':').map(Number), 0, 0, 0);

      let delay = scheduledTimeToday.getTime() - now.getTime();
      if (delay < 0) {
        delay += 24 * 60 * 60 * 1000;
      }

      setTimeout(() => {
        sendScheduledMessage(client, channelId, scheduledItem.message);

        const interval = setInterval(() => {
          sendScheduledMessage(client, channelId, scheduledItem.message);
        }, 24 * 60 * 60 * 1000);

        client.messageIntervals.set(`${channelId}-${scheduledItem.id}`, interval);
      }, delay);
    });
  }
}

client.on("messageCreate", async (message) => {

  if (message.mentions.users.has(client.user.id) && !message.mentions.everyone && message.mentions.roles.size === 0) {
    console.log("Bot was mentioned directly.");
    aboutCommand(message);
  }

  if (!message.content.startsWith(process.env.BOT_PREFIX) || message.author.bot) return;

  if (message.guild.id != process.env.ALLOWED_GUILDS) {
    console.log("Not allowed guild");
    return sendNotAllowedEmbed(message);
  }

  const args = message.content.slice(1).split(/ +/);
  const command = args.shift().toLowerCase();



  if (command === "help") {
    console.log('HELPPPP');
    helpCommand(message);
  } else if (command === "about") {
    aboutCommand(message);
  }

  const hasAdminPermission = message.member.permissions.has(PermissionsBitField.Flags.Administrator);
  if (command === "setautopurge" || command === "showautopurge" || command === "removeautopurge" || command === "schedulemessage" || command === "showscheduledmessages" || command === "removescheduledmessage" || command === "purge") {
    if (!hasAdminPermission) {
      const errorEmbed = new EmbedBuilder()
        .setColor(0xff0000)
        .setTitle("🚫 Insufficient Permissions")
        .setDescription("You need to be an administrator to use this command you dumb peice of shit.")
        .setFooter({
          text: process.env.AUTHOR + " | " + new Date().toLocaleDateString(),
        })
        .setTimestamp();

      message.channel.send({ embeds: [errorEmbed] });
      return;
    }

    if (command === "setautopurge") {
      setAutoPurgeCommand(client, message, args);
    } else if (command === "showautopurge") {
      showAutoPurgeCommand(message);
    } else if (command === "removeautopurge") {
      removeAutoPurgeCommand(client, message, args);
    } else if (command === "schedulemessage") {
      await scheduleMessageCommand(client, message, args);
    } else if (command === "showscheduledmessages") {
      showScheduledMessagesCommand(message);
    } else if (command === "removescheduledmessage") {
      removeScheduledMessageCommand(client, message, args);
    } else if (command === "purge") {
      purgeCommand(message, args);
    }
  }
});

client.login(process.env.BOT_TOKEN);
