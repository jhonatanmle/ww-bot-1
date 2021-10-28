const { default: axios } = require("axios");
const { MessageMedia } = require("whatsapp-web.js");
const constants = require("./constants.js");

const REPLACE_TOKEN = "PRICE_TOKEN";
const priceApi = `https://api.coingecko.com/api/v3/simple/price?ids=${REPLACE_TOKEN}&vs_currencies=USD`;

const getPrice = async (word) => {
  const { data } = await axios.get(priceApi.replace(REPLACE_TOKEN, word));

  const { usd } = data[word] || { usd: "## Error ##" };

  return usd;
};

const calculateTokenToUSD = async (msg) => {
  let units = msg.split("-");
  const command = units[0];
  console.log();
  const count = units[1];
  const word = constants[command].id;
  const usd = await getPrice(word);

  return (usd * count).toFixed(2);
};

const getTokenToUSD = async (command, message, client) => {
  try {
    const calculate = await calculateTokenToUSD(command);
    client.sendMessage(message.from, `Total - 💰 ${calculate} USD 💰`);
  } catch (error) {
    console.error(error);
    client.sendMessage(message.from, "## Error ##");
  }
};

const getMessageCommand = async (command, message, client) => {
  let word = "";
  let usd = "";
  let media;

  if (constants[command]?.id) {
    word = constants[command].id;
    usd = await getPrice(word);

    client.sendMessage(
      message.from,
      constants[command].message.replace("$AMOUNT", usd)
    );
    return;
  } else {
    if (command === "michilalo" || command === "cristhian") {
      client.sendMessage(message.from, `Cristhian correlón! 🏃🏃`);
      media = MessageMedia.fromFilePath("./meme/michilalo.jpeg");
      client.sendMessage(message.from, media, {
        sendMediaAsSticker: true,
      });

      media = MessageMedia.fromFilePath("./meme/dead.jpeg");
      client.sendMessage(message.from, media);
    } else if (command === "bajito" || command === "sandro") {
      media = MessageMedia.fromFilePath("./meme/sandro.jpg");
      client.sendMessage(message.from, media, {
        sendMediaAsSticker: true,
      });
      client.sendMessage(message.from, `Sandro bajito 💩`);
    } else if (command === "jumsek") {
      media = MessageMedia.fromFilePath("./meme/jumsek.jpeg");
      client.sendMessage(message.from, media, {
        sendMediaAsSticker: true,
      });
    } else if (command === "jairo") {
      client.sendMessage(message.from, `Sandro me vas a pagar? 😡`);
    }
  }
};

module.exports = {
  getTokenToUSD,
  getMessageCommand,
};
