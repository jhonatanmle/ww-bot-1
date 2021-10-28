const { default: axios } = require("axios");
const scholars = require("./scholars.js");

const URL = "https://axie.tech/ajax/getScholarInfo.php";
const URL_TABLA = process.env.AXIE_TABLE;

const getStateElo = (elo) => {
  if (elo >= 1800) {
    return `👑`;
  } else if (2000 > elo && elo >= 1800) {
    return `🤑`;
  } else if (1800 > elo && elo >= 1500) {
    return `🤩`;
  } else if (1500 > elo && elo >= 1300) {
    return `😎`;
  } else if (1300 > elo && elo >= 1100) {
    return `😐`;
  } else if (1100 > elo && elo >= 1000) {
    return `🤧`;
  } else if (1000 > elo && elo >= 800) {
    return `🤢`;
  } else {
    return `☠️`;
  }
};

const getStatesElo = (message, client) => {
  let data = "";

  data += `Copas - 🧮\n\n`;
  data += `2000 - 👑\n`;
  data += `1800 - 🤑\n`;
  data += `1500 - 🤩\n`;
  data += `1300 - 😎\n`;
  data += `1100 - 😐\n`;
  data += `1000 - 🤧\n`;
  data += `800 - 🤢\n`;
  data += `RIP - ☠️\n`;

  client.sendMessage(message.from, data);
};

const readFormat = (chain = "", scholar) => {
  const numbers = chain.split(",");

  return {
    name: scholar.name,
    elo: numbers[1],
  };
};

const getInfoScholars = async () => {
  let listScholars = [];
  let urls = [];

  try {
    for (let index = 0; index < scholars.length; index++) {
      const element = scholars[index];

      const url = `${URL}?addr=${element.ronin}`;

      urls.push(url);
    }

    const promises = urls.map((url) =>
      axios.get(url, {
        timeout: 5000,
      })
    );

    const response = await Promise.all(promises);

    for (let index = 0; index < response.length; index++) {
      const { data } = response[index];

      listScholars.push(readFormat(data, scholars[index]));
    }

    listScholars = listScholars.sort(function (a, b) {
      return b.elo - a.elo;
    });
  } catch (error) {
    console.error(error);
  }

  // try {
  //   for (let index = 0; index < scholars.length; index++) {
  //     const element = scholars[index];

  //     const { data } = await axios.get(`${URL}?addr=${element.ronin}`, {
  //       timeout: 5000,
  //     });
  //     listScholars.push(readFormat(data, element));

  //     listScholars = listScholars.sort(function (a, b) {
  //       return b.elo - a.elo;
  //     });
  //   }
  // } catch (error) {
  //   console.error(error);
  // }

  return listScholars;
};

const getMessageScholars = async () => {
  let message = "";
  const scholars = await getInfoScholars();

  message += `Nombre -- ELO 🏆 \n\n`;

  for (let index = 0; index < scholars.length; index++) {
    const element = scholars[index];
    message += `${element.name} - ${
      element.elo
        ? `${element.elo} ${getStateElo(element.elo)}`
        : `No se pudo obtener la información 🏳️`
    } \n`;
  }

  message += `\n`;
  message += `Detalle de la tabla: \n`;
  message += URL_TABLA;

  return message;
};

const getMessageAxie = async (message, client) => {
  const axies = await getMessageScholars();
  client.sendMessage(message.from, axies);
};

module.exports = {
  getMessageAxie,
  getStatesElo,
};
