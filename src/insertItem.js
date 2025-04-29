const { v4: uuidv4 } = require('uuid');
const AWS = require("aws-sdk");

const insertItem = async (event) => {
  console.info("Evento recebido:", event);

  let body;
  try {
    body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
  } catch (e) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Corpo da requisição inválido" })
    };
  }

  if (!body || !body.item) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Campo 'item' é obrigatório" })
    };
  }

  const { item } = body;
  const createdAt = new Date().toISOString();
  const id = uuidv4();

  const dynamoDB = new AWS.DynamoDB.DocumentClient();

  const newItem = {
    id,
    item,
    createdAt,
    itemStatus: false
  };

  try {
    await dynamoDB.put({
      TableName: "ItemTableNew",
      Item: newItem
    }).promise(); // <- importante: .promise() para async/await funcionar

    return {
      statusCode: 200,
      body: JSON.stringify(newItem)
    };
  } catch (err) {
    console.error("Erro ao inserir no DynamoDB", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Erro interno ao salvar item" })
    };
  }
};

module.exports = {
  handler: insertItem
};