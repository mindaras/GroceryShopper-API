const AmazonCognitoIdentity = require("amazon-cognito-identity-js");
const { UserPoolId, ClientId } = require("./config");
global.fetch = require("node-fetch");

module.exports.main = async event => {
  const { username: Username, password: Password } = JSON.parse(event.body);
  const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(
    { Username, Password }
  );
  const Pool = new AmazonCognitoIdentity.CognitoUserPool({
    UserPoolId,
    ClientId
  });
  const cognitoUser = new AmazonCognitoIdentity.CognitoUser({
    Username,
    Pool
  });

  return await new Promise(resolve => {
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: result => {
        const idToken = result.getIdToken().getJwtToken();
        const refreshToken = result.getRefreshToken().getToken();

        resolve({
          statusCode: 200,
          body: JSON.stringify({
            username: Username,
            idToken,
            refreshToken
          })
        });
      },
      onFailure: err => {
        resolve({
          statusCode: 500,
          body: JSON.stringify({
            message: err.message || "Could not signin the user."
          })
        });
      }
    });
  });
};
