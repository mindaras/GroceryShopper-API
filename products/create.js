const AWS = require("aws-sdk");
const uuid = require("uuid");

const documentClient = new AWS.DynamoDB.DocumentClient();

module.exports.main = async event => {
  const { name, type, price } = JSON.parse(event.body);
  const params = {
    TableName: process.env.PRODUCTS_TABLE,
    Item: {
      id: uuid.v1(),
      name,
      type,
      price
    }
  };

  return await new Promise(resolve => {
    documentClient.put(params, err => {
      if (err) {
        resolve({
          statusCode: 501,
          body: JSON.stringify({ message: err || "Could not create an item." })
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
