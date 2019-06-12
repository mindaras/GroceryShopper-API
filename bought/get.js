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

        const date = new Date();

        date.setDate(1);
        date.setHours(0, 0, 0, 0);

        const params = {
          TableName: process.env.BOUGHT_TABLE,
          KeyConditionExpression: "#s = :b and #t > :t",
          ExpressionAttributeNames: {
            "#s": "status",
            "#t": "timestamp"
          },
          ExpressionAttributeValues: {
            ":b": "bought",
            ":t": date.getTime()
          }
        };

        documentClient.query(params, function(err, data) {
          if (err) {
            resolve({
              statusCode: 500,
              body: JSON.stringify({
                message: err.message || "Could not get items."
              })
            });
          } else {
            resolve({ statusCode: 200, body: JSON.stringify(data.Items) });
          }
        });
      })
      .catch(e =>
        resolve({
          statusCode: 401,
          body: JSON.stringify({ message: "Unauthorized operation." })
        })
      );
  });
};
