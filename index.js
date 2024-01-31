const fs = require("fs");
const { Client, GatewayIntentBits } = require("discord.js");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
  ],
});
const express = require("express");
const app = express();
require("dotenv").config();

//機密情報取得
const token = process.env.token;
const PORT = 8000;

///////////////////////////////////////////////////
fs.readdir("./events", (_err, files) => {
  files.forEach((file) => {
    if (!file.endsWith(".js")) return;
    const event = require(`./events/${file}`);
    let eventName = file.split(".")[0];
    console.log(`クライアントイベントの読み込みが完了: ${eventName}`);
    client.on(eventName, event.bind(null, client));
    delete require.cache[require.resolve(`./events/${file}`)];
  });
});

client.commands = [];
fs.readdir("./commands", (err, files) => {
  if (err) throw err;
  files.forEach(async (f) => {
    try {
      if (f.endsWith(".js")) {
        let props = require(`./commands/${f}`);
        client.commands.push({
          name: props.name,
          description: props.description,
          options: props.options,
        });
        console.log(`コマンドの読み込みが完了: ${props.name}`);
      }
    } catch (err) {
      console.log(err);
    }
  });
});

if (token) {
  client.login(token).catch((err) => {
    console.log(
      "プロジェクトに入力したボットのトークンが間違っているか、ボットのINTENTSがオフになっています!"
    );
  });
} else {
  setTimeout(() => {
    console.log(
      "ボットのトークンをプロジェクト内の.envファイルに設定してください!"
    );
  }, 2000);
}

app.get("/", (request, response) => {
  response?.sendStatus(200);
});
app.listen(PORT, function () {
  console.log(`[NodeJS] Application Listening on Port ${PORT}`);
});
