const AWS = require("aws-sdk");

const fetchItems = async (event) => {
  const dynamoDB = new AWS.DynamoDB.DocumentClient();

  let items = [];

  try {
    const result = await dynamoDB.scan({
      TableName: "ItemTableNew"
    }).promise();

    items = result.Items;
  } catch (error) {
    console.error("Erro ao buscar itens:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Erro ao buscar itens na tabela" })
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(items)
  };
};

module.exports = {
  handler: fetchItems
};
