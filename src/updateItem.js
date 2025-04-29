const AWS = require("aws-sdk");

const updateItem = async (event) => {
  console.info("Evento recebido:", JSON.stringify(event, null, 2));

  let body;
  try {
    body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Corpo da requisição inválido" })
    };
  }

  const { itemStatus } = body;
  const { id } = event.pathParameters;

  if (typeof itemStatus === 'undefined' || !id) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "'id' e 'itemStatus' são obrigatórios" })
    };
  }

  const dynamoDB = new AWS.DynamoDB.DocumentClient();

  try {
    const result = await dynamoDB.update({
      TableName: "ItemTableNew",
      Key: { id },
      UpdateExpression: "set itemStatus = :itemStatus",
      ExpressionAttributeValues: {
        ":itemStatus": itemStatus
      },
      ReturnValues: "ALL_NEW"
    }).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ msg: "Item atualizado com sucesso", item: result.Attributes })
    };
  } catch (err) {
    console.error("Erro ao atualizar item:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Erro ao atualizar o item" })
    };
  }
};

module.exports = {
  handler: updateItem
};
