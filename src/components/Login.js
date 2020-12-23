import React, { useState, useContext, useEffect } from 'react';
import { AccountContext } from './Accounts';

export default () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [status, setStatus] = useState(false);

  const { authenticate, updateNewPassword, getSession } = useContext(AccountContext);

  useEffect(() => {
    getSession()
      .then(session => {
        console.log('Session:', session);
        setStatus(true);
      })
  }, []);

  const onSubmit = event => {
    event.preventDefault();

    authenticate(email, password)
      .then(data=> {
        console.log('Logged in ', data)
        // if(isChangePasswordRequired){
        //   console.log('isChangePassword required ', isChangePasswordRequired);
        // } else {
        //   console.log('isChangePassword not required ', isChangePasswordRequired);
        // }
      })
      .catch(err => {
        console.error('Failed to login!', err);
      })
  };

  const onUpdateNewPassword = event => {
    event.preventDefault();

    updateNewPassword(email, newPassword)
      .then(data => {
        console.log('Logged in!', data);
      })
      .catch(err => {
        console.error('Failed to login!', err);
      })
  };

  return (
    <div>
      {!status ? (
        <div>

          <form onSubmit={onSubmit}>
            <input
              value={email} placeholder="Enter Email Address"
              onChange={event => setEmail(event.target.value)}
            />

            <input
              value={password} placeholder="Enter Password"
              onChange={event => setPassword(event.target.value)}
            />

            <button type='submit'>Login</button>
          </form>

          <form onSubmit={onUpdateNewPassword}>
            <br />
        User was signed up by an admin and you are required to enter new password to proceed
        <br />
            <input
              value={newPassword} placeholder="Enter New Password"
              onChange={event => setNewPassword(event.target.value)}
            />

            <button type='submit'>Update</button>
          </form>
        </div>
      ) : ''}
    </div>
  );
};