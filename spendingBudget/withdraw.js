const AWS = require("aws-sdk");
const decodeVerify = require("../auth/decodeVerify");

const documentClient = new AWS.DynamoDB.DocumentClient();

module.exports.main = async event => {
  const { username, idToken, amount } = JSON.parse(event.body);

  return await new Promise(resolve => {
    const params = {
      TableName: process.env.SPENDING_BUDGET_TABLE,
      Key: { id: "spendingBudget" },
      UpdateExpression: "set #a = #a - :a",
      ExpressionAttributeNames: { "#a": "amount" },
      ExpressionAttributeValues: { ":a": amount },
      ReturnValues: "ALL_NEW"
    };

    documentClient.update(params, (err, data) => {
      if (err) {
        resolve({
          statusCode: 500,
          body: JSON.stringify({
            message: err.message || "Could not update spending budget."
          })
        });
      } else {
        resolve({ statusCode: 200, body: JSON.stringify(data.Attributes) });
      }
    });
  });
};
