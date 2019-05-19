const AmazonCognitoIdentity = require("amazon-cognito-identity-js");
const { UserPoolId, ClientId } = require("./config");
global.fetch = require("node-fetch");

module.exports.main = async event => {
  const { username, password } = JSON.parse(event.body);
  const userPool = new AmazonCognitoIdentity.CognitoUserPool({
    UserPoolId,
    ClientId
  });
  const attributes = [{ Name: "email", Value: username }];
  const attributeList = attributes.map(
    attribute => new AmazonCognitoIdentity.CognitoUserAttribute(attribute)
  );

  return await new Promise(resolve => {
    userPool.signUp(username, password, attributeList, null, (err, result) => {
      if (err) {
        resolve({
          statusCode: 500,
          body: JSON.stringify({
            message: err.message || "Could not signup the user."
          })
        });
      } else {
        resolve({
          statusCode: 200,
          body: JSON.stringify({ username: result.user.username })
        });
      }
    });
  });
};
