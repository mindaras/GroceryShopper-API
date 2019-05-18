const AWS = require("aws-sdk");

const documentClient = new AWS.DynamoDB.DocumentClient();

module.exports.main = async event => {
  const params = {
    TableName: process.env.SHOPPING_LIST_TABLE
  };

  return new Promise(resolve => {
    documentClient.scan(params, (err, data) => {
      if (err) {
        resolve({
          statusCode: 500,
          message: err.message || "Could not get items."
        });
      } else {
        resolve({ statusCode: 200, body: JSON.stringify(data.Items) });
      }
    });
  });
};
