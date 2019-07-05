const { sceneStack } = require('../src/sceneStack');

const makeMockContext = ({ currentScene = '', session = {} } = {}) => {
  const ctx = {
    currentScene, // only exists for this test, not in real context
    session,
  };
  ctx.scene = {
    enter: (sceneName) => {
      ctx.currentScene = sceneName;
    },
    leave: () => {
      ctx.currentScene = '';
    },
  }
  return ctx;
};

const isSceneStack = (obj) => {
  if (typeof obj !== 'object') {
    return false;
  }
  for (let method of ['init', 'sideStep', 'leave']) {
    if (typeof obj[method] !== 'function') {
      return false;
    }
  }
  return true;
};

test('sceneStack.init initializes the context', () => {
  const ctx = makeMockContext();
  const result = sceneStack(ctx).init();
  expect(ctx.session.sceneStack).toStrictEqual([]);
  expect(isSceneStack(result)).toBe(true);
});

test('sceneStack.enter adds a new item to ctx.session.sceneStack', () => {
  const ctx = makeMockContext({
    session: { sceneStack: ['base'] },
  });
  const result = sceneStack(ctx).enter('inner');
  expect(ctx.session.sceneStack).toStrictEqual(['base', 'inner']);
  expect(ctx.currentScene).toStrictEqual('inner');
  expect(isSceneStack(result)).toBe(true);
});

test('sceneStack.sideStep[] modify the last item in ctx.session.sceneStack', () => {
  const ctx = makeMockContext({
    session: { sceneStack: ['base', 'inner1'] },
  });
  const result = sceneStack(ctx).sideStep('inner2');
  expect(ctx.session.sceneStack).toStrictEqual(['base', 'inner2']);
  expect(ctx.currentScene).toStrictEqual('inner2');
  expect(isSceneStack(result)).toBe(true);
});

test('sceneStack.leave[] remove the last item in the stack and enter the last scene', () => {
  const ctx = makeMockContext({
    session: { sceneStack: ['base', 'inner1', 'inner2'] },
  });
  const result = sceneStack(ctx).leave();
  expect(ctx.session.sceneStack).toStrictEqual(['base', 'inner1']);
  expect(ctx.currentScene).toStrictEqual('inner1');
  expect(isSceneStack(result)).toBe(true);
});
