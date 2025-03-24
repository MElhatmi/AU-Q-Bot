const queue = [];

function getQueue() {
  return queue;
}

function addToQueue(userId, displayName) {
  if (!queue.find((p) => p.userId === userId)) {
    queue.push({ userId, displayName, timestamp: Date.now() });
    return true;
  }
  return false;
}

function removeFromQueue(userId) {
  const index = queue.findIndex((p) => p.userId === userId);
  if (index !== -1) {
    queue.splice(index, 1);
    return true;
  }
  return false;
}

function getQueueList() {
  if (queue.length === 0) return "\nNo one in the queue.";

  const lines = queue.map((p, i) => `${i + 1}. ${p.displayName}`);
  return `\n${lines.join("\n")}`;
}

module.exports = {
  getQueue,
  addToQueue,
  removeFromQueue,
  getQueueList,
};
