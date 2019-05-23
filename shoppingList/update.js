const AWS = require("aws-sdk");
const decodeVerify = require("../auth/decodeVerify");

const documentClient = new AWS.DynamoDB.DocumentClient();

module.exports.main = async event => {
  const { username, idToken, productId, name, type, price, keys } = JSON.parse(
    event.body
  );

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

        const updates = keys.map(({ id }) => {
          const params = {
            TableName: process.env.SHOPPING_LIST_TABLE,
            Item: {
              id,
              productId,
              name,
              type,
              price
            }
          };

          return new Promise((res, rej) => {
            documentClient.put(params, err => {
              if (err) rej(err.message || "Could not update an item.");
              else res(id);
            });
          });
        });

        Promise.all(updates)
          .then(result => {
            resolve({
              statusCode: 200,
              body: JSON.stringify({ updated: result.map(id => id) })
            });
          })
          .catch(e => {
            resolve({ statusCode: 501, body: JSON.stringify({ message: e }) });
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
