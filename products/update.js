const AWS = require("aws-sdk");

const documentClient = new AWS.DynamoDB.DocumentClient();

module.exports.main = async event => {
  const { id, name, type, price } = JSON.parse(event.body);
  const params = {
    TableName: process.env.PRODUCTS_TABLE,
    Item: {
      id,
      name,
      type,
      price
    }
  };

  return new Promise(resolve => {
    documentClient.put(params, err => {
      if (err) {
        resolve({
          statusCode: 501,
          message: err.message || "Could not update an item."
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
