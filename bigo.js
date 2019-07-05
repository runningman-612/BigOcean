require("dotenv").config();

process.on("unhandledRejection", e => {
  console.log(e);
});
process.on("uncaughtException", e => {
  console.log(e);
});
process.on("rejectionHandled", event => {
  console.log(event);
});

const Telegraf = require("telegraf");
require("telegraf/extra");
const Markup = require("telegraf/markup");
const session = require("telegraf/session");
const Stage = require("telegraf/stage");
const Scene = require("telegraf/scenes/base");
const unicodeLength = require("unicode-length");
const { createChatQueue } = require("./src/chatQueue");
const { sceneStack } = require("./src/sceneStack");

const namelist = require("./name.json");

const max_message_keep = process.env.MAX_MESSAGE_KEEP
  ? parseInt(process.env.MAX_MESSAGE_KEEP, 10)
  : undefined;
const group_name = process.env.GROUPNAME || "大閪洋";

// BOT_TOKEN
const bot = new Telegraf(process.env.TELEGRAM_API_KEY);
const {
  chatQueue,
  findChat,
  removeChat,
  renameChat,
  findChatByName,
  kickChat,
  isKick
} = createChatQueue();

const delay = 15;
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

let adminsArray = [];

function updateConfig() {
  adminsArray =
    typeof process.env.ADMINS !== "undefined"
      ? process.env.ADMINS.split(",").map(x => parseInt(x, 10))
      : [];
}
updateConfig();

function makeChiName() {
  let newName = "";
  const byName = chat => chat[1] === newName;
  while (
    newName.length === 0 ||
    newName.length > 10 ||
    chatQueue.find(byName)
  ) {
    const polarizer =
      Math.round(Math.random() * Math.random()) == 1 ? "pos" : "neg";
    const adjID = Math.floor(Math.random() * namelist[polarizer].adj.length);
    const nameID = Math.floor(Math.random() * namelist[polarizer].name.length);
    newName = `${namelist[polarizer].adj[adjID]}${
      namelist[polarizer].name[nameID]
    }`;
  }

  return newName;
}

const isAdmin = userId => adminsArray.includes(userId);

const escapeMarkdown = text =>
  (text || "").replace(/(^`)|([*[_])|(?:[^`])(`)(?:[^`])/g, "\\$&");

const escaperenameMarkdown = text => {
  return (text || "").replace(/(^`)|([\*\[_])|(?:[^`])(`)(?:[^`])/g, "");
};

const removeusermessage = async ctx => {
  try {
    // console.log(ctx.message)
    await ctx.telegram.deleteMessage(
      ctx.message.from.id,
      ctx.message.message_id
    );
  } catch (error) {
    console.log(error);
  }
};

const replypushmsg = async (ctx, message, markup) => {
  try {
    let my_message = await ctx.reply(message, markup);
    const user = chatQueue.find(
      userInQueue => userInQueue[0] === ctx.message.chat.id
    );
    if (user && max_message_keep) {
      // console.log(my_message.message_id)
      user[4].push(my_message.message_id);
    }
  } catch (error) {
    console.log(error);
  }
};

const announce = async (
  message,
  speakerId = -1,
  type = "text",
  caption = "",
  silent = false
) => {
  chatQueue.forEach(async user => {
    try {
      if (user[3]) {
        //[3] Kick status
        return;
      }
      if (type === "text") {
        let my_message = await bot.telegram.sendMessage(user[0], message, {
          parse_mode: "Markdown",
          disable_notification: silent
        });
        if (max_message_keep) {
          user[4].push(my_message.message_id);
        }
        // await bot.telegram.sendMessage(user[0], message, {
        //   parse_mode: "Markdown",
        //   disable_notification: silent
        // })
      } else if (type === "sticker") {
        let my_message = await bot.telegram.sendSticker(user[0], message);
        if (max_message_keep) {
          user[4].push(my_message.message_id);
        }
        // await bot.telegram.sendSticker(user[0], message);
      } else if (type === "image") {
        let my_message = await bot.telegram.sendPhoto(user[0], message, {
          caption
        });
        if (max_message_keep) {
          user[4].push(my_message.message_id);
        }
        // await bot.telegram.sendPhoto(user[0], message, { caption })
      }
      await sleep(delay);
      if (max_message_keep && user[4].length > max_message_keep) {
        var endofRemove = user[4].length - max_message_keep;

        for (var i = 0; i < endofRemove; i++) {
          bot.telegram.deleteMessage(user[0], user[4][i]);
          await sleep(delay);
        }
        user[4].splice(0, endofRemove);
      }
    } catch (error) {
      const {
        code,
        on: {
          payload: { chat_id: chatId }
        }
      } = error;
      if (
        typeof code !== "undefined" &&
        code === 403 &&
        typeof chatId !== "undefined"
      ) {
        // console.log(error);
        removeChat(chatId);
        return;
      }
      console.log(error);
    }
  });
};

const validateUsername = (ctx, queue, username) => {
  // check length limit
  const limit = 10;
  if (unicodeLength.get(username) > limit) {
    // ctx.reply(`Chatroom » 個名太長啦，唔該 ${limit} 個字元之內丫。`);
    replypushmsg(ctx, `Chatroom » 個名太長啦，唔該 ${limit} 個字元之內丫。`);
    return false;
  }

  // make sure name does not begin with slash
  // if (username.match(/^\//)) {
  //   ctx.reply('Chatroom » 個名有啲奇怪，唔好用 "/" 行頭啦喂。');
  //   return false;
  // }

  // make sure name does not contain linebreak or tab
  if (username.match(/[\n\r\t\/]+/) || unicodeLength.get(username) == 0) {
    // ctx.reply('Chatroom » 個名有啲奇怪嘢，請淨係用中文字或者英文字母。');
    replypushmsg(
      ctx,
      "Chatroom » 個名有啲奇怪嘢，請淨係用中文字或者英文字母。"
    );
    return false;
  }

  // check name repeat
  const foundChat = chatQueue.find(chat => chat[1] === username);
  if (
    typeof foundChat !== "undefined" &&
    foundChat[0] !== ctx.message.chat.id
  ) {
    // ctx.reply("Chatroom » 撞名！唔該再諗過。");
    replypushmsg(ctx, "Chatroom » 撞名！唔該再諗過。");
    return false;
  }
  return true;
};

const chatKeyboard = () =>
  Markup.keyboard([
    `/rename ${makeChiName()}`,
    "/rename 更改我的名字",
    "/online 查看上線人數",
    "/myname 查看我的名字",
    "/quit 離開Chatroom"
  ])
    .resize()
    .extra();

const removeKeyboard = () =>
  Markup.keyboard()
    .removeKeyboard(true)
    .extra();

const chatScene = new Scene("chatScene");

chatScene.use((ctx, next) => {
  try {
    if (isKick(ctx.message.chat.id)) {
      ctx.reply(`SYSTEM » you have been banned`, chatKeyboard());
    } else {
      next(ctx);
    }
  } catch (error) {
    console.log(error);
  }
});

chatScene.enter(ctx => {
  try {
    const username = makeChiName();
    // console.log(`${ctx.message.chat.id} enter chatScene`);

    const foundChat = findChat(ctx.message.chat.id);
    if (typeof foundChat === "undefined") {
      chatQueue.push([ctx.message.chat.id, username, true, false, []]);
      process.stdout.write("n");
      // ctx.reply(
      //   `歡迎加入大閪洋，你可以自由講乜都得。依家你個名係「${username}」 \n隨時輸入指令 /rename XXX 可以改名，/quit 停止收取信息`,
      //   chatKeyboard()
      // );
      replypushmsg(
        ctx,
        `歡迎加入${group_name}，你可以自由講乜都得。依家你個名係「${username}」 \n隨時輸入指令 /rename XXX 可以改名，/quit 停止收取信息`,
        chatKeyboard()
      );
      // announce(`${username} 加入大閪洋`);
      return;
    }

    // console.log(`${ctx.message.chat.id} exists in queue`);
    process.stdout.write("o");
  } catch (error) {
    console.log(error);
  }
});

/*
chatScene.leave((ctx) => {
  console.log(`${ctx.message.chat.id} leave chatScene`);
});
*/

chatScene.command("myname", (ctx, next) => {
  const user = chatQueue.find(
    userInQueue => userInQueue[0] === ctx.message.chat.id
  );
  // ctx.reply(`Chatroom » 你的名字是: ${user[1]}`);
  replypushmsg(ctx, `Chatroom » 你的名字是: ${user[1]}`);
  removeusermessage(ctx);
});

// chatScene.command("echo", ctx => {
//   const userIndex = chatQueue.findIndex(
//     name => name[0] === ctx.message.chat.id
//   );
//   chatQueue[userIndex][2] = !chatQueue[userIndex][2];
//   ctx.reply(`Chatroom » 回音Mode已${chatQueue[userIndex][2] ? "開" : "關"}`);
// });

chatScene.command("quit", (ctx, next) => {
  removeChat(ctx.message.chat.id);
  sceneStack(ctx).leave();
  ctx.reply("登已出，資料已清，你可以隨時打 /start 回來", removeKeyboard());
  removeusermessage(ctx);
});

chatScene.command("online", async (ctx, next) => {
  // ctx.reply(`Chatroom » ${chatQueue.length}名玩家在線`);
  replypushmsg(ctx, `Chatroom » ${chatQueue.length}名玩家在線`);
  removeusermessage(ctx);
});

chatScene.command("rename", (ctx, next) => {
  const matches = ctx.update.message.text.match(/^\/rename ([^/]+)/);
  const username = matches ? escaperenameMarkdown(matches[1].trim()) : "";
  if (matches === null || username === "更改我的名字" || username === "") {
    sceneStack(ctx).enter("renameScene");
    return;
  }

  // validate username
  if (validateUsername(ctx, chatQueue, username) !== true) {
    return;
  }
  renameChat(ctx.message.chat.id, username);
  // ctx.reply(`Chatroom » 你已改名做 "${username}"`, chatKeyboard());
  replypushmsg(ctx, `Chatroom » 你已改名做 "${username}"`, chatKeyboard());
  removeusermessage(ctx);
});

chatScene.command("serverupdate", async (ctx, next) => {
  if (isAdmin(ctx.message.chat.id)) {
    updateConfig();
    ctx.reply("SYSTEM » Updated", chatKeyboard());
  }
  removeusermessage(ctx);
});

chatScene.command("kick", async (ctx, next) => {
  if (isAdmin(ctx.message.chat.id)) {
    const matches = ctx.update.message.text.match(/^\/kick ([^/]+)/);
    if (matches === null) {
      ctx.reply("SYSTEM » kick who?", chatKeyboard());
      return;
    }
    const kickUsername = matches[1].trim();
    const chat = findChatByName(kickUsername);

    if (chat) {
      const [chatId, username] = chat;
      if (ctx.message.chat.id == chatId || isAdmin(chatId)) {
        // ctx.reply(`SYSTEM » WTF?Kick yourself?`, chatKeyboard());
        replypushmsg(ctx, `SYSTEM » WTF?Kick yourself?`, chatKeyboard());
        return;
      }
      // ctx.reply(`SYSTEM » "${username}" is kicked`, chatKeyboard());
      announce(
        `SYSTEM » "${username}" 已被踢出${group_name}`,
        chatId,
        undefined,
        undefined,
        true
      );
      kickChat(chatId);
    } else {
      ctx.reply("SYSTEM » username not found", chatKeyboard());
    }
  } else {
    console.log(`${ctx.message.chat.id} tried with kick`);
  }
  removeusermessage(ctx);
});

chatScene.start(async (ctx, next) => {
  // let get = await ctx.reply(
  //   `Chatroom » 乖啦，你已經入左架啦，等人開聲，不如做第一個講野？`,
  //   chatKeyboard()
  // );

  replypushmsg(
    ctx,
    `Chatroom » 乖啦，你已經入左架啦，等人開聲，不如做第一個講野？`,
    chatKeyboard()
  );
  removeusermessage(ctx);
});

chatScene.hears(/(^\/).*/, (ctx, next) => {
  // ctx.reply(
  //   `Chatroom » 唔好玩野，指令目錄在錄音制隔離個四筒icon！`,
  //   chatKeyboard()
  // );
  replypushmsg(
    ctx,
    `Chatroom » 唔好玩野，指令目錄在錄音制隔離個四筒icon！`,
    chatKeyboard()
  );
  removeusermessage(ctx);
});

chatScene.on("text", async (ctx, next) => {
  const [chatId, username] = findChat(ctx.message.chat.id);
  announce(
    `*${username}*${isAdmin(chatId) ? " » " : ": "}${escapeMarkdown(
      ctx.message.text
    )}`,
    chatId
  );
  // arrayMove(chatQueue, chatQueue.length - 1, 0);
  process.stdout.write("s");
  removeusermessage(ctx);
});

chatScene.on("message", async (ctx, next) => {
  const [chatId, username] = findChat(ctx.message.chat.id);
  if (ctx.message.sticker) {
    announce(`${username}發出一個Sticker`, chatId);
    announce(ctx.message.sticker.file_id, chatId, "sticker");
    // ctx.telegram.sendSticker(ctx.message.chat.id, ctx.message.sticker.file_id)
  } else if (ctx.message.photo) {
    announce(
      ctx.message.photo[0].file_id,
      chatId,
      "image",
      `${username}發出一張圖片`
    );
  } else {
    ctx.reply("不支持你發的垃圾，目前只接受Sticker和圖");
  }
  removeusermessage(ctx);
});

const renameScene = new Scene("renameScene");

renameScene.enter(ctx => {
  // console.log(`${ctx.message.chat.id} enter renameScene`);
  // ctx.reply("Chatroom » 你想改做乜嘢名？", removeKeyboard());
  replypushmsg(ctx, "Chatroom » 你想改做乜嘢名？", removeKeyboard());
});

renameScene.on("text", async ctx => {
  const username = escaperenameMarkdown(ctx.message.text.trim());

  // validate username
  if (validateUsername(ctx, chatQueue, username) !== true) {
    return;
  }

  // const foundChat = findQueuById(chatQueue, ctx.message.chat.id);
  // announce(`"${foundChat[1]}" 已改名做 "${username}"`);
  renameChat(ctx.message.chat.id, username);
  // ctx.reply(`Chatroom » 你已改名做 "${username}"`, chatKeyboard());
  replypushmsg(ctx, `Chatroom » 你已改名做 "${username}"`, chatKeyboard());
  sceneStack(ctx).leave();
});

const stage = new Stage([chatScene, renameScene]);

bot.use(session());
bot.use(stage.middleware());

bot.start(ctx =>
  sceneStack(ctx)
    .init()
    .enter("chatScene")
);
bot.on("message", ctx => ctx.reply("請輸入 /start 開始", removeKeyboard()));

bot.launch();

console.log("ChatBot started");
