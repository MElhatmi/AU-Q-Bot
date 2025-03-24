const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} = require("discord.js");

const { getQueueList } = require("../queueStore");

module.exports = async function sendInitialPanel(client) {
  const channelId = process.env.PANEL_CHANNEL_ID;
  const channel = await client.channels.fetch(channelId);

  if (!channel || !channel.isTextBased()) {
    console.error("❌ Panel channel not found or not text-based.");
    return;
  }

  const queueText = getQueueList() || "No one in the queue.";

  const embed = new EmbedBuilder()
    .setTitle("Queue:")
    .setDescription(queueText)
    .setColor(0x2f3136);

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("join_button")
      .setLabel("Join")
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId("dc_button")
      .setLabel("DC")
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId("leave_button")
      .setLabel("Leave")
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId("tag_button")
      .setLabel("Tag")
      .setStyle(ButtonStyle.Success)
  );

  try {
    await channel.send({
      embeds: [embed],
      components: [row],
    });

    console.log("✅ Initial queue panel sent.");
  } catch (err) {
    console.error("❌ Failed to send initial panel:", err);
  }
};
