const AWS = require("aws-sdk");

const documentClient = new AWS.DynamoDB.DocumentClient();

module.exports.main = async event => {
  const params = {
    TableName: process.env.PRODUCTS_TABLE,
    Key: {
      id: event.pathParameters.id
    }
  };

  return await new Promise(resolve => {
    documentClient.get(params, (err, data) => {
      if (err) {
        resolve({
          statusCode: 500,
          body: JSON.stringify({
            message: err.message || "Could not get an item."
          })
        });
      } else {
        resolve({ statusCode: 200, body: JSON.stringify(data) });
      }
    });
  });
};
