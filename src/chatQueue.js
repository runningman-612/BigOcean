/*
chatQueue = Array([chatId, username, EchoOn, Kicked])
*/
function createChatQueue() {
  const chatQueue = [];

  const findChat = chatId => chatQueue.find(chat => chat[0] === chatId);

  const findChatByName = username => chatQueue.find(chat => chat[1] === username);

  const kickChat = (chatId) => {
    const foundId = chatQueue.findIndex(user => user[0] === chatId);
    if (foundId > -1) {
      chatQueue[foundId][3] = true;
    }
  };

  const isKick = (chatId) => {
    const foundId = chatQueue.findIndex(user => user[0] === chatId);
    if (foundId > -1) {
      return chatQueue[foundId][3];
    }
    return false;
  };

  const removeChat = (chatId) => {
    const foundId = chatQueue.findIndex(user => user[0] === chatId);
    if (foundId > -1) {
      chatQueue.splice(foundId, 1);
    }
    process.stdout.write('L');
  };

  const renameChat = (chatId, newName) => {
    for (let i = 0; i < chatQueue.length; i += 1) {
      if (chatQueue[i][0] === chatId) {
        process.stdout.write('r');
        chatQueue[i][1] = newName;
        break;
      }
    }
  };

  return {
    chatQueue,
    findChat,
    removeChat,
    renameChat,
    findChatByName,
    kickChat,
    isKick,
  };
}

module.exports = {
  createChatQueue,
};
