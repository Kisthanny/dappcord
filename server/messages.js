const {generateRandomString} = require("./utils")

const getRoomId = (server, channel) => {
  return `${server.toLocaleLowerCase()}-${channel.toLocaleLowerCase()}`;
};

class Message {
  constructor({ id, server, channel, account, text }) {
    this.id = id;
    this.server = server;
    this.channel = channel;
    this.account = account;
    this.text = text;
  }
}

class MessageRecord {
  constructor() {
    this.history = {};
  }
  addMessage({  server, channel, account, text }) {
    const id = generateRandomString(16);
    const message = new Message({
      id,
      server,
      channel,
      account,
      text,
    });
    const roomId = getRoomId(server, channel);
    if (!this.history[roomId]) {
      this.history[roomId] = [];
    }
    this.history[roomId].push(message);
  }
  getMessagesFromRoom({ server, channel }) {
    const roomId = getRoomId(server, channel);
    return this.history[roomId] || [];
  }
}

const messageRecord = new MessageRecord();

module.exports = messageRecord;
