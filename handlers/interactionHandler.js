const {
  addToQueue,
  removeFromQueue,
  getQueueList,
  getQueue,
} = require("../queueStore");

const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} = require("discord.js");

module.exports = async function handleInteraction(interaction) {
  const userId = interaction.user.id;
  const displayName = interaction.member.displayName;

  let queueChanged = false;

  try {
    switch (interaction.customId) {
      case "join_button":
        if (addToQueue(userId, displayName)) {
          queueChanged = true;
        }
        await interaction.deferUpdate();
        break;

      case "leave_button":
        if (removeFromQueue(userId)) {
          queueChanged = true;
        }
        await interaction.deferUpdate();
        break;

      case "tag_button": {
        const queue = getQueue();
        if (queue.length === 0) {
          await interaction.deferUpdate();
          return;
        }

        const { userId: targetUserId } = queue.shift();
        await interaction.reply({
          content: `Hey <@${targetUserId}>, you're up! - ${displayName}`,
          allowedMentions: { users: [targetUserId] },
        });

        queueChanged = true;
        break;
      }

      case "dc_button": {
        const q = getQueue();
        const index = q.findIndex((p) => p.userId === userId);
        if (index !== -1) q.splice(index, 1);

        q.unshift({ userId, displayName, timestamp: Date.now() });
        queueChanged = true;

        await interaction.deferUpdate();
        break;
      }
    }

    if (queueChanged) {
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
        await interaction.channel.send({
          embeds: [embed],
          components: [row],
        });

        await interaction.message.delete().catch((err) => {
          if (err.code === 10008) {
            console.warn("⚠️ Tried to delete a message that no longer exists.");
          } else {
            console.error("Failed to delete panel:", err);
          }
        });
      } catch (err) {
        console.error("❌ Failed to update queue panel:", err);
      }
    }
  } catch (err) {
    console.error("Interaction error:", err);
    if (!interaction.replied && !interaction.deferred) {
      await interaction.reply({
        content: "❌ Something went wrong.",
        flags: 1 << 6,
      });
    }
  }
};
