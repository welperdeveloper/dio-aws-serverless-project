const AWS = require('aws-sdk');
const s3 = new AWS.S3();

module.exports.handler = async (event) => {
  try {
    const listParams = {
      Bucket: 'upload-bucket-dio-liver-serverless',
      // Se quiser listar de uma pasta específica dentro do bucket:
      // Prefix: 'WelperDIODev/', 
    };

    const data = await s3.listObjectsV2(listParams).promise();

    const files = data.Contents.map((item) => ({
      key: item.Key,
      lastModified: item.LastModified,
      size: item.Size,
      url: `https://${listParams.Bucket}.s3.amazonaws.com/${item.Key}`,
    }));

    return {
      statusCode: 200,
      body: JSON.stringify({
        files,
      }),
    };
  } catch (error) {
    console.error('Erro ao listar arquivos:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Erro ao listar arquivos',
        error: error.message,
      }),
    };
  }
};
