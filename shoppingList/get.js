const AWS = require("aws-sdk");

const documentClient = new AWS.DynamoDB.DocumentClient();

module.exports.main = async event => {
  const { id, timestamp } = event.pathParameters;
  const params = {
    TableName: process.env.SHOPPING_LIST_TABLE,
    Key: {
      id,
      timestamp: parseInt(timestamp, 10)
    }
  };

  return new Promise(resolve => {
    documentClient.get(params, (err, data) => {
      if (err) {
        resolve({
          statusCode: 500,
          message: err.message || "Could not get an item."
        });
      } else {
        resolve({ statusCode: 200, body: JSON.stringify(data.Item) });
      }
    });
  });
};
