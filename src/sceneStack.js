function sceneStack(ctx) {
  // Initialize
  const init = () => {
    if (typeof ctx.session.sceneStack === 'undefined') {
      ctx.session.sceneStack = [];
    }
    return sceneStack(ctx);
  };

  // Enter into an inner scene.
  const enter = (sceneName) => {
    ctx.session.sceneStack.push(sceneName);
    ctx.scene.enter(sceneName);
    return sceneStack(ctx);
  };

  // Switching to another scene on the same level.
  const sideStep = (sceneName) => {
    ctx.session.sceneStack.pop();
    ctx.session.sceneStack.push(sceneName);
    ctx.scene.enter(sceneName);
    return sceneStack(ctx);
  };

  // Leaving inner scene to outer.
  const leave = () => {
    const currentScene = ctx.session.sceneStack.pop();
    if (ctx.session.sceneStack.length > 0) {
      ctx.scene.enter(ctx.session.sceneStack[ctx.session.sceneStack.length - 1]);
      return sceneStack(ctx);
    }
    ctx.scene.leave(currentScene);
    return sceneStack(ctx);
  };

  return {
    init,
    enter,
    sideStep,
    leave,
  };
}

module.exports = {
  sceneStack,
};
