# 大閪洋 (Big Ocean) 討論 Bot

支援 Telegram 用戶互相匿名交流討論的 Bot。

- [大閪洋 (Big Ocean) 討論 Bot](#%E5%A4%A7%E9%96%AA%E6%B4%8B-Big-Ocean-%E8%A8%8E%E8%AB%96-Bot)
	- [1. 使用需求](#1-%E4%BD%BF%E7%94%A8%E9%9C%80%E6%B1%82)
		- [1.1. 有一部不關機的電腦](#11-%E6%9C%89%E4%B8%80%E9%83%A8%E4%B8%8D%E9%97%9C%E6%A9%9F%E7%9A%84%E9%9B%BB%E8%85%A6)
		- [1.2. 懂得使用命令介面](#12-%E6%87%82%E5%BE%97%E4%BD%BF%E7%94%A8%E5%91%BD%E4%BB%A4%E4%BB%8B%E9%9D%A2)
		- [1.3. 安裝 NodeJS](#13-%E5%AE%89%E8%A3%9D-NodeJS)
		- [1.4. 安裝 `pm2`](#14-%E5%AE%89%E8%A3%9D-pm2)
		- [1.5. 取得 Telegram Bot token](#15-%E5%8F%96%E5%BE%97-Telegram-Bot-token)
	- [2. 安裝](#2-%E5%AE%89%E8%A3%9D)
	- [3. 開發模式](#3-%E9%96%8B%E7%99%BC%E6%A8%A1%E5%BC%8F)

##  1. 使用需求

要使用本程式，你必需︰


###  1.1. 有一部不關機的電腦

這個 Telegram 是用 API 的 long-poll 機制運作，令你無需要將電腦的任何 IP 連接埠開放到互聯網，但是你的電腦必需長期運作，否則你的 bot 會不能做任何回應。

###  1.2. 懂得使用命令介面

你必需懂得使用命令介面 (Terminal) 操作電腦。如果不懂，建議閱讀下面的資源︰

1. [Windows](https://www.computerhope.com/issues/chusedos.htm)
2. [MacOS](https://blog.teamtreehouse.com/introduction-to-the-mac-os-x-command-line)
3. [Linux](https://developer.ibm.com/tutorials/l-lpic1-103-1/)

###  1.3. 安裝 NodeJS

1. 在上面提過的電腦，下載及安裝 [nodejs](https://nodejs.org/en/download/)。
2. 若一切運作正常，你應該可以正確執行指令︰ `node --version`.
   而你會得到類似這格式的回應（而不是錯誤訊息）︰`v12.4.0`.

###  1.4. 安裝 `pm2`

我們推介用 [pm2](http://pm2.keymetrics.io/) 去執行程式及監看程式運行，請執行這個安裝指令︰

```bash
npm install pm2 -g
```

###  1.5. 取得 Telegram Bot token

1. [新增](https://telegramguide.com/create-a-telegram-account/)或登入你的 Telegram 帳戶。
2. [跟 BotFather 註冊一個新的 bot 名稱](https://core.telegram.org/bots#6-botfather)。
3. 將 BotFather 回應中，類似 `0123456789:some-strange-hash-text` 格式的 token 碼記下來。


##  2. 安裝

你可以用找到的 Zip 檔下載，或者用 [Git](https://git-scm.com/downloads) 下載最新的源碼。

請將 `.env.example` 複製成 `.env` ，然後修改這一行︰

```.env
TELEGRAM_API_KEY=some-telegram-bot-api-key
```

將 `some-telegram-bot-api-key` 置換成「[取得 Telegram Bot token]((#15-%E5%8F%96%E5%BE%97-Telegram-Bot-token))」步驟中得到的 token。

然後在放置源碼的資料匣內，執行下列命令︰

```bash
npm install
npm start
```

##  3. 開發模式

如果你懂得 `nodejs`，你可以用開發模式進行開發。

你可以用下列指令，用開發模式啟動你的 bot:

```bash
npm dev
```
