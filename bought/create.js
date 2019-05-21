const AWS = require("aws-sdk");
const uuid = require("uuid");
const decodeVerify = require("../auth/decodeVerify");

const documentClient = new AWS.DynamoDB.DocumentClient();

module.exports.main = async event => {
  const { username, idToken, name, price, type } = JSON.parse(event.body);
  const params = {
    TableName: process.env.BOUGHT_TABLE,
    Item: {
      id: uuid.v1(),
      timestamp: Date.now(),
      name,
      price,
      type
    }
  };

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

        documentClient.put(params, err => {
          if (err) {
            resolve({
              statusCode: 501,
              body: JSON.stringify({
                message: err.message || "Cannot create an item."
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
