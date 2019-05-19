const AWS = require("aws-sdk");
const decodeVerify = require("../auth/decodeVerify");

const documentClient = new AWS.DynamoDB.DocumentClient();

module.exports.main = async event => {
  const { username, idToken, id, timestamp } = JSON.parse(event.body);
  const params = {
    TableName: process.env.SHOPPING_LIST_TABLE,
    Key: {
      id,
      timestamp
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

        documentClient.delete(params, err => {
          if (err) {
            resolve({
              statusCode: 501,
              body: JSON.stringify({
                message: err.message || "Could not delete an item."
              })
            });
          } else {
            resolve({ statusCode: 200, body: JSON.stringify({ id }) });
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
