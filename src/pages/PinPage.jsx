// pages/PinPage.jsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/authContext';
import { collection, getFirestore, doc, getDocs, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config.js';
import { Typography, Container, Paper, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton } from '@mui/material';
import RoomIcon from '@mui/icons-material/Room';
import { chatRoomsCollection, messagesCollection, userPinsCollection, pinnedRoomsCollection } from '../constants/constants.js';
import { useNavigate, Link } from 'react-router-dom';


const PinPage = () => {
  const { currentUser } = useAuth();
  const [pinnedRooms, setPinnedRooms] = useState([]);

  useEffect(() => {
    // Fetch pinned rooms from Firestore or local storage (based on user's authentication status)
    if (currentUser) {
      const userPinsRef = doc(db, userPinsCollection, currentUser.uid);
      const pinnedRoomsRef = collection(userPinsRef, pinnedRoomsCollection);

      // Query the pinned rooms collection
      const fetchPinnedRooms = async () => {
        const pinnedRoomsSnapshot = await getDocs(pinnedRoomsRef);
        const pinnedRoomsData = pinnedRoomsSnapshot.docs.map((doc) => doc.data());        
        setPinnedRooms(pinnedRoomsData);
      };

      fetchPinnedRooms();
    } else {
      const pinnedRoomsFromLocalStorage = JSON.parse(localStorage.getItem(pinnedRoomsCollection) || '[]');      
      setPinnedRooms(pinnedRoomsFromLocalStorage);
    }
  }, []); 


  return (
    <Container maxWidth="sm">
      <Typography sx={{ m: 2 }} variant="h4" component="h1" gutterBottom>
        Pinned Chat Rooms
      </Typography>

      {pinnedRooms.length === 0 ? (
        <Typography variant="body1">You haven't pinned any chat rooms yet.</Typography>
      ) : (
        <List>
          {pinnedRooms.map((room) => (
            <ListItem key={room.roomId} component={Link} to={`/chat/${room.roomId}`}>
              <RoomIcon />
              <ListItemText primary={room.chatRoomName} />
            </ListItem>
          ))}
        </List>
      )} 
     
    </Container>
  );
};

export default PinPage;
