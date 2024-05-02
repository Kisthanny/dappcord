class Message {
  constructor({ id, serverAddress, channelId, accountAddress, text }) {
    this.id = id;
    this.serverAddress = serverAddress;
    this.channelId = channelId;
    this.accountAddress = accountAddress;
    this.text = text;
  }
}

class Messages {
  constructor() {
    this.history = {};
  }
  addMessage({ id, serverAddress, channelId, accountAddress, text }) {
    const message = new Message({
      id,
      serverAddress,
      channelId,
      accountAddress,
      text,
    });
    const historyId = `${serverAddress}-${channelId}`;
    if (!this.history[historyId]) {
      this.history[historyId] = [];
    }
    this.history[historyId].push(message);
  }
  getMessagesFromChannel({ serverAddress, channelId }) {
    const historyId = `${serverAddress}-${channelId}`;
    return this.history[historyId] || [];
  }
}

const messages = new Messages();

module.exports = messages;