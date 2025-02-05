import React, { useState } from 'react';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../firebase/config';

const GrantAdmin = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const addAdminRole = httpsCallable(functions, 'addAdminRole');
    try {
      const result = await addAdminRole({ email });
      setMessage(result.data.message);
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div>
      <h1>Grant Admin Role</h1>
      <form onSubmit={handleSubmit}>
        <label>Email: </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit">Grant Admin</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default GrantAdmin;
