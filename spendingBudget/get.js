const AWS = require("aws-sdk");

const documentClient = new AWS.DynamoDB.DocumentClient();

module.exports.main = async event => {
  const params = {
    TableName: process.env.SPENDING_BUDGET_TABLE,
    Key: {
      id: "spendingBudget"
    }
  };

  return await new Promise(resolve => {
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
  });
};
