const AWS = require("aws-sdk");
const uuid = require("uuid");

const documentClient = new AWS.DynamoDB.DocumentClient();

module.exports.main = async event => {
  const { name, price, type } = JSON.parse(event.body);
  const params = {
    TableName: process.env.SHOPPING_LIST_TABLE,
    Item: {
      id: uuid.v1(),
      timestamp: Date.now(),
      name,
      price,
      type
    }
  };

  return new Promise(resolve => {
    documentClient.put(params, err => {
      if (err) {
        resolve({
          statusCode: 501,
          message: err.message || "Cannot create an item."
        });
      } else {
        resolve({
          statusCode: 200,
          body: JSON.stringify({ id: params.Item.id })
        });
      }
    });
  });
};
