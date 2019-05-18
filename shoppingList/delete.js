const AWS = require("aws-sdk");

const documentClient = new AWS.DynamoDB.DocumentClient();

module.exports.main = async event => {
  const { id, timestamp } = JSON.parse(event.body);
  const params = {
    TableName: process.env.SHOPPING_LIST_TABLE,
    Key: {
      id,
      timestamp
    }
  };

  return new Promise(resolve => {
    documentClient.delete(params, err => {
      if (err) {
        resolve({
          statusCode: 501,
          message: err.message || "Could not delete an item."
        });
      } else {
        resolve({ statusCode: 200, body: JSON.stringify({ id }) });
      }
    });
  });
};
