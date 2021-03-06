const AmazonCognitoIdentity = require("amazon-cognito-identity-js");
const { UserPoolId, ClientId } = require("./config");
global.fetch = require("node-fetch");

module.exports.main = async event => {
  const { username: Username, token: RefreshToken } = JSON.parse(event.body);
  const refreshToken = new AmazonCognitoIdentity.CognitoRefreshToken({
    RefreshToken
  });
  const Pool = new AmazonCognitoIdentity.CognitoUserPool({
    UserPoolId,
    ClientId
  });
  const cognitoUser = new AmazonCognitoIdentity.CognitoUser({ Username, Pool });

  return await new Promise(resolve => {
    cognitoUser.refreshSession(refreshToken, (err, session) => {
      if (err)
        resolve({
          statusCode: 500,
          body: JSON.stringify({
            message: err.message || "Could not refresh the session."
          })
        });
      else {
        resolve({
          statusCode: 200,
          body: JSON.stringify({
            idToken: session.getIdToken().getJwtToken(),
            refreshToken: refreshToken.getToken()
          })
        });
      }
    });
  });
};
