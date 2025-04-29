const AWS = require("aws-sdk");

const fetchItem = async (event) => {
  const dynamoDB = new AWS.DynamoDB.DocumentClient();

  const { id } = event.pathParameters;

  let item;

  try {
    const result = await dynamoDB.get({
      TableName: "ItemTableNew",
      Key: { id }
    }).promise();

    item = result.Item;
  } catch (error) {
    console.error("Erro ao buscar item:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Erro ao buscar item" })
    };
  }

  if (!item) {
    return {
      statusCode: 404,
      body: JSON.stringify({ error: "Item não encontrado" })
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(item)
  };
};

module.exports = {
  handler: fetchItem
};
