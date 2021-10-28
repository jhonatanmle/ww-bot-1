require("dotenv").config();
const qrcode = require("qrcode-terminal");
const { Client } = require("whatsapp-web.js");
const { getTokenToUSD, getMessageCommand } = require("./crypto/index");
const { getMessageAxie } = require("./axies/index");

let sessionLocal = JSON.parse(process.env.WW_SESSION);

const puppeteerOptions = {
  headless: true,
  args: ["--no-sandbox"],
};

const client = new Client({
  puppeteer: puppeteerOptions,
  session: sessionLocal,
});

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("authenticated", (session) => {
  // Save this session object in WW_SESSION manually to reuse it next time
});

client.on("ready", () => {
  console.log("Client is ready!");
});

client.on("message", async (message) => {
  const check = message.body.toLowerCase();

  if (check.search("!") > -1) {
    let command = check.replace("!", "");

    if (command.search("-") > -1) {
      await getTokenToUSD(command, message, client);
      return;
    }

    if (command === "tablav") {
      await getMessageAxie(message, client);
      return;
    }

    await getMessageCommand(command, message, client);
    return;
  }
});

client.initialize();
