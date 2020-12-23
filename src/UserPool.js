import { CognitoUserPool } from 'amazon-cognito-identity-js';

const poolData = {
  UserPoolId: '<<COGNITO-USER-POOL-ID>>',
  ClientId: '<<APP-CLIENT-ID>>'
};

export default new CognitoUserPool(poolData);