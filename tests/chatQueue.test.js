const { createChatQueue } = require('../src/chatQueue');

test('chatQueue.findChat finds chat of a given chat id', () => {
  const { chatQueue, findChat } = createChatQueue();
  chatQueue.push([1234, 'hello', false, false]);
  expect(findChat(1234)).toStrictEqual([1234, 'hello', false, false]);
  expect(findChat(1235)).toBe(undefined);
});

test('chatQueue.findChatByName finds chat of a given username', () => {
  const { chatQueue, findChatByName } = createChatQueue();
  chatQueue.push([1234, 'hello', false, false]);
  expect(findChatByName('hello')).toStrictEqual([1234, 'hello', false, false]);
  expect(findChatByName('world')).toBe(undefined);
});

test('chatQueue.isKick reports correctly that a subscribed chat is kicked or not', () => {
  const {
    chatQueue,
    isKick,
  } = createChatQueue();

  chatQueue.push([1234, 'hello', false, false]);
  chatQueue.push([5678, 'world', false, true]);

  expect(isKick(1234)).toBe(false);
  expect(isKick(5678)).toBe(true);
});

test('chatQueue.kickChat marks a subscribed chat as kicked', () => {
  const {
    chatQueue,
    findChat,
    kickChat,
    isKick,
  } = createChatQueue();

  chatQueue.push([1234, 'hello', false, false]);
  expect(findChat(1234)).toStrictEqual([1234, 'hello', false, false]);
  expect(isKick(1234)).toBe(false);

  // kick
  kickChat(1234);

  expect(findChat(1234)).toStrictEqual([1234, 'hello', false, true]);
  expect(isKick(1234)).toBe(true);
});

test('chatQueue.removeChat unsubscribs a chat from chatQueue', () => {
  const {
    chatQueue,
    findChat,
    removeChat,
  } = createChatQueue();

  chatQueue.push([1234, 'hello', false, false]);
  expect(findChat(1234)).toStrictEqual([1234, 'hello', false, false]);

  // kick
  removeChat(1234);

  expect(findChat(1234)).toBe(undefined);
});

test('chatQueue.renameChat renames a given chat id', () => {
  const {
    chatQueue,
    findChat,
    renameChat,
  } = createChatQueue();

  chatQueue.push([1234, 'hello', false, false]);
  expect(findChat(1234)).toStrictEqual([1234, 'hello', false, false]);

  // kick
  renameChat(1234, 'world');

  expect(findChat(1234)).toStrictEqual([1234, 'world', false, false]);
});
