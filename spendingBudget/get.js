const AWS = require("aws-sdk");
const decodeVerify = require("../auth/decodeVerify");

const documentClient = new AWS.DynamoDB.DocumentClient();

module.exports.main = async event => {
  const { username, idToken } = JSON.parse(event.body);

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
          TableName: process.env.SPENDING_BUDGET_TABLE,
          Key: {
            id: "spendingBudget"
          }
        };

        documentClient.get(params, (err, data) => {
          if (err) {
            resolve({
              statusCode: 500,
              body: JSON.stringify({
                message: err.message || "Could not get spending budget."
              })
            });
          } else {
            resolve({ statusCode: 200, body: JSON.stringify(data.Item) });
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
