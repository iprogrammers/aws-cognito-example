import React, { createContext } from 'react'
import { CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js'
import Pool from '../UserPool'

const AccountContext = createContext()
var sessionUserAttributes;
var cognitoUser;

const Account = (props) => {
  const getSession = async () =>
    await new Promise((resolve, reject) => {
      const user = Pool.getCurrentUser()
      if (user) {
        user.getSession(async (err, session) => {
          if (err) {
            reject()
          } else {
            const attributes = await new Promise((resolve, reject) => {
              user.getUserAttributes((err, attributes) => {
                if (err) {
                  reject(err)
                } else {
                  console.log('attributes:', attributes)
                  const results = {}

                  for (let attribute of attributes) {
                    const { Name, Value } = attribute
                    results[Name] = Value
                  }

                  resolve(results)
                }
              })
            })

            const token = session.getIdToken().getJwtToken()

            resolve({
              user,
              headers: {
                //'x-api-key': attributes['custom:apikey'],
                Authorization: token,
              },
              ...session,
              ...attributes,
            })
          }
        })
      } else {
        reject()
      }
    })

  const authenticate = async (Username, Password) =>
    await new Promise((resolve, reject) => {
      cognitoUser = new CognitoUser({ Username, Pool })
      const authDetails = new AuthenticationDetails({ Username, Password })

      cognitoUser.authenticateUser(authDetails, {
        onSuccess: (data) => {
          console.log('onSuccess:', data)
          resolve(data)
        },

        onFailure: (err) => {
          console.error('onFailure:', err)
          reject(err)
        },

        newPasswordRequired: (userAttributes, requiredAttributes) => {
          // User was signed up by an admin and must provide new
          // password and required attributes, if any, to complete
          // authentication.
          console.log('newPasswordRequired:', userAttributes)
          // the api doesn't accept this field back
          //delete userAttributes.email_verified;

          console.log('Initiate change password flow requiredAttributes>', requiredAttributes)

          // store userAttributes on global variable
          sessionUserAttributes = userAttributes;
          
          resolve(userAttributes)
        },
      })
    })


  const updateNewPassword = async (Username, newPassword) => await new Promise((resolve, reject) => {

    console.log('Username ', Username);
    console.log('newPassword ', newPassword);

    delete sessionUserAttributes.email_verified;
    sessionUserAttributes['name'] = Username
    console.log('sessionUserAttributes ', sessionUserAttributes)
    cognitoUser.completeNewPasswordChallenge(newPassword, sessionUserAttributes, {
      onSuccess: (data) => {
        console.log('updateNewPassword onSuccess:', data)
        resolve(data)
      },

      onFailure: (err) => {
        console.error('updateNewPassword onFailure:', err)
        reject(err)
      },
    })
  })

  const logout = () => {
    const user = Pool.getCurrentUser()
    if (user) {
      user.signOut()
    }
  }

  return (
    <AccountContext.Provider
      value={{
        authenticate,
        updateNewPassword,
        getSession,
        logout,
      }}
    >
      {props.children}
    </AccountContext.Provider>
  )
}

export { Account, AccountContext }
