# Big Ocean chatbot

A Telegram bot to enable anoymous communication between Telegram users.

- [Big Ocean chatbot](#Big-Ocean-chatbot)
	- [1.Prerequisites](#1Prerequisites)
		- [1.1. Have a Non-stop-running Computer](#11-Have-a-Non-stop-running-Computer)
		- [1.2. Knows how to use Command Line](#12-Knows-how-to-use-Command-Line)
		- [1.3. Setup NodeJS](#13-Setup-NodeJS)
		- [1.4. Install `pm2`](#14-Install-pm2)
		- [1.5. Get a Telegram Bot token](#15-Get-a-Telegram-Bot-token)
	- [2. Installation](#2-Installation)
	- [3. Development](#3-Development)

##  1.Prerequisites

To use this bot, you need to:


###  1.1. Have a Non-stop-running Computer

This bot is running with the long-poll mechanism. You don't have to have a public IP.
But you need to run your computer non-stop.

###  1.2. Knows how to use Command Line

You need to know how to work with command line on your computer. If you're not sure,
please read these resources:

1. [Windows](https://www.computerhope.com/issues/chusedos.htm)
2. [MacOS](https://blog.teamtreehouse.com/introduction-to-the-mac-os-x-command-line)
3. [Linux](https://developer.ibm.com/tutorials/l-lpic1-103-1/)

###  1.3. Setup NodeJS

1. Download and install [nodejs](https://nodejs.org/en/download/) on the computer.
2. To be sure, try to run this in your command line interface: `node --version`.
   You should see a version string like `v12.4.0`.

###  1.4. Install `pm2`

We recommend you to use [pm2](http://pm2.keymetrics.io/) to run and monitor the process
of this bot. To install `pm2`, you can run the command:

```bash
npm install pm2 -g
```

###  1.5. Get a Telegram Bot token

1. [Create a Telegram account](https://telegramguide.com/create-a-telegram-account/).
2. [Register a new Telegram bot ID with BotFather](https://core.telegram.org/bots#6-botfather).
3. Store the token you get from BotFather somewhere.


##  2. Installation

Either download any archive file you found, or use [Git](https://git-scm.com/downloads)
to download the latest source code.

Copy the file `.env.example` as `.env`. Then modify this line in it:

```.env
TELEGRAM_API_KEY=some-telegram-bot-api-key
```

Replace `some-telegram-bot-api-key` with the token you got in the [Get a Telegram Bot token]((#15-Get-a-Telegram-Bot-token)) step.

Then run the command in the source code folder:

```bash
npm install
npm start
```

##  3. Development

If you know nodejs, you can enhance the bot's feature with the help of development mode.

To run the bot in development mode, instead of `npm start`, you may run the bot with:

```bash
npm dev
```
