require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const handleInteraction = require("./handlers/interactionHandler");
const sendInitialPanel = require("./panels/sendPanel");

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

client.once("ready", async () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
  await sendInitialPanel(client);
});

client.on("interactionCreate", (interaction) => {
  if (interaction.isButton()) {
    handleInteraction(interaction);
  }
});

client.login(process.env.DISCORD_TOKEN);
