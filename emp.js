require("dotenv").config();

const Telegraf = require("telegraf");

// BOT_TOKEN
const bot = new Telegraf(process.env.TELEGRAM_API_KEY);

bot.launch();

console.log("Request Cleared");
