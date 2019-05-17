const AWS = require("aws-sdk");

const documentClient = new AWS.DynamoDB.DocumentClient();

module.exports.main = async event => {
  const { id } = JSON.parse(event.body);
  const params = {
    TableName: process.env.PRODUCTS_TABLE,
    Key: {
      id
    }
  };

  return new Promise(resolve => {
    documentClient.delete(params, err => {
      if (err) {
        resolve({
          statusCode: 500,
          message: err || "Could not delete an item."
        });
      } else {
        resolve({ statusCode: 200, body: JSON.stringify({ id }) });
      }
    });
  });
};
