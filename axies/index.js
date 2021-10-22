const { default: axios } = require("axios");
const scholars = require("./scholars.js");

const URL = "https://axie.tech/ajax/getScholarInfo.php";
const URL_TABLA = process.env.AXIE_TABLE;

const getStateElo = (elo) => {
  if (elo >= 1500) {
    return `🤑`;
  } else if (1500 > elo && elo >= 1300) {
    return `😎`;
  } else if (1300 > elo && elo >= 1100) {
    return `😐`;
  } else if (1100 > elo && elo >= 1000) {
    return `🤧`;
  } else if (1000 > elo && elo >= 950) {
    return `😭`;
  } else {
    return `☠️`;
  }
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

  try {
    for (let index = 0; index < scholars.length; index++) {
      const element = scholars[index];

      const { data } = await axios.get(`${URL}?addr=${element.ronin}`);
      listScholars.push(readFormat(data, element));

      listScholars = listScholars.sort(function (a, b) {
        return b.elo - a.elo;
      });
    }
  } catch (error) {
    console.error(error);
  }

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
};
