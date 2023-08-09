// components/Logout.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Notification from './Notification';
import useLocalStorage from '../hooks/useLocalStorage';
import { auth } from '../firebase/config';
import { signOut } from 'firebase/auth';

const Logout = () => {
  const navigate = useNavigate();    
  const [openNotification, setOpenNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');    
  const [user, setUser] = useLocalStorage('user', null);

  useEffect(() => {    

    signOut(auth).then(() => {
      setOpenNotification(true);
      setNotificationMessage('Logged out succesfully'); 
      setUser(null);        
      setTimeout(() => {
        setOpenNotification(false);
        navigate('/signin');
      }, 2000);
    }).catch((error) => {
        console.log(error);
        navigate('/signin');
    });
    
  }, []);

  // return null; // This component doesn't render anything, it's just for handling logout and redirection
  return (
    <Notification open={openNotification} onClose={() => setOpenNotification(false)} message={notificationMessage} />
  )
};

export default Logout;
