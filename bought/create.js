const AWS = require("aws-sdk");
const decodeVerify = require("../auth/decodeVerify");

const documentClient = new AWS.DynamoDB.DocumentClient();

module.exports.main = async event => {
  const { username, idToken, id, name, price, type } = JSON.parse(event.body);
  const boughtParams = {
    TableName: process.env.BOUGHT_TABLE,
    Item: {
      status: "bought",
      timestamp: Date.now(),
      name,
      price,
      type
    }
  };
  const deleteParams = {
    TableName: process.env.SHOPPING_LIST_TABLE,
    Key: { id }
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

        const operations = [];

        operations.push(
          new Promise((res, rej) => {
            documentClient.put(boughtParams, err => {
              if (err) rej(err.message || "Cannot create an item.");
              else res();
            });
          })
        );

        operations.push(
          new Promise((res, rej) => {
            documentClient.delete(deleteParams, err => {
              if (err) rej(err.message || "Cannot delete an item.");
              else res();
            });
          })
        );

        Promise.all(operations)
          .then(() => {
            resolve({
              statusCode: 200,
              body: JSON.stringify({ timestamp: boughtParams.Item.timestamp })
            });
          })
          .catch(e =>
            resolve({ statusCode: 501, body: JSON.stringify({ message: e }) })
          );
      })
      .catch(e => {
        resolve({
          statusCode: 401,
          body: JSON.stringify({ message: "Unauthorized operation." })
        });
      });
  });
};
