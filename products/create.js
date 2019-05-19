const AWS = require("aws-sdk");
const uuid = require("uuid");
const decodeVerify = require("../auth/decodeVerify");

const documentClient = new AWS.DynamoDB.DocumentClient();

module.exports.main = async event => {
  const { username, idToken, name, type, price } = JSON.parse(event.body);

  return await new Promise(resolve => {
    decodeVerify(idToken)
      .then(({ email }) => {
        if (email !== username) {
          resolve({
            statusCode: 401,
            body: JSON.stringify({ message: "Unauthorized operation." })
          });
          return;
        }

        const params = {
          TableName: process.env.PRODUCTS_TABLE,
          Item: {
            id: uuid.v1(),
            name,
            type,
            price
          }
        };

        documentClient.put(params, err => {
          if (err) {
            resolve({
              statusCode: 501,
              body: JSON.stringify({
                message: err.message || "Could not create an item."
              })
            });
          } else {
            resolve({
              statusCode: 200,
              body: JSON.stringify({ id: params.Item.id })
            });
          }
        });
      })
      .catch(e => {
        resolve({
          statusCode: 401,
          body: JSON.stringify({ message: "Unauthorized operation." })
        });
      });
  });
};
