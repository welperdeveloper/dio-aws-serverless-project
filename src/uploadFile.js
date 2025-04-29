const AWS = require('aws-sdk');
const multipart = require('parse-multipart');
const s3 = new AWS.S3();

module.exports.handler = async (event) => {
  try {
    const contentType = event.headers['content-type'] || event.headers['Content-Type'];
    const boundary = multipart.getBoundary(contentType);
    const bodyBuffer = Buffer.from(event.body, 'base64');
    const parts = multipart.Parse(bodyBuffer, boundary);

    console.log('Boundary:', boundary);
    console.log('Parts:', parts);

    const file = parts && parts.length > 0 ? parts[0] : null;

    if (!file) {
      throw new Error('Nenhum arquivo enviado ou erro no formato do multipart/form-data.');
    }

    const uploadParams = {
      Bucket: 'upload-bucket-dio-liver-serverless',
      Key: file.filename,
      Body: file.data,
      ContentType: file.type,
    };

    await s3.putObject(uploadParams).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Arquivo enviado com sucesso!',
        fileName: file.filename,
      }),
    };
  } catch (error) {
    console.error('Erro no upload:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Erro no upload',
        error: error.message,
      }),
    };
  }
};
