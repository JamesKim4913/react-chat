// pages/DashboardPage.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, doc, query, where, getDocs, deleteDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config.js';  // Import Firestore instance (db)
import { chatRoomsCollection, messagesCollection } from '../constants/constants.js';
import { Typography, Container, Paper, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Button } from '@mui/material';
import { useAuth  } from '../contexts/authContext'; // Import the useAuth hook
import RoomIcon from '@mui/icons-material/Room';
import CopyIcon from '@mui/icons-material/FileCopy'; // Import the copy icon
import DeleteIcon from '@mui/icons-material/Delete';
import { CopyToClipboard } from 'react-copy-to-clipboard'; // Import the copy-to-clipboard component
import Notification from '../components/Notification';
import { useNavigate } from 'react-router-dom';


const DashboardPage = () => { 
  const navigate = useNavigate();
  const { currentUser } = useAuth(); // Use the useAuth hook to get the currentUser
  const [openNotification, setOpenNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [chatRooms, setChatRooms] = useState([]);

  const handleDeleteChatRoom = async (roomId) => {
    // Delete the chat room from Firestore
    try { 
      await deleteDoc(doc(db, chatRoomsCollection, roomId)); 
      alertSnackbar('Chat room deleted successfully!');   
      // Remove the deleted chat room from the state
      setChatRooms((prevChatRooms) => prevChatRooms.filter((room) => room.id !== roomId));  
      
      // send message that chat room is deleted
      handleSendMessage(roomId, "The current chat room has been deleted.");
    } catch (error) {
      console.error('Error deleting chat room:', error);
    }
  };

  // display notification
  const alertSnackbar = (message) => {
    setOpenNotification(true);
      setNotificationMessage(message);
      setTimeout(() => {
          setOpenNotification(false);          
    }, [2000]);
  }

  const goCreatChatRoom = () => {
    // Check if the user is logged in
    if (!currentUser) {
      alert("Please log in to create a chat room.");
      const timeout = setTimeout(() => navigate('/signin'), 100);
      return () => {
        clearTimeout(timeout);
      }; 
    } else {
      navigate('/create');
    } 
  }

  // Fetch the chat rooms created by the current user from Firestore
  const fetchChatRooms = async () => {
    try { 
      // Construct the Firestore query to get chat rooms created by the user       
      const chatRoomsQuery = query(collection(db, chatRoomsCollection), where('createdBy', '==', currentUser?.email));

      // Get the chat room documents matching the query
      const chatRoomsSnapshot = await getDocs(chatRoomsQuery);

      // Map the chat room data to an array of objects
      const chatRoomsData = chatRoomsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setChatRooms(chatRoomsData);
    } catch (error) {
      console.error('Error fetching chat rooms:', error);
    }
  };

  useEffect(() => { 
    fetchChatRooms();
  }, []);

  
  // Send message to chat room
  const handleSendMessage = async (roomId, message) => {  
    try {  
      // Save the new message to Firestore
      await addDoc(collection(db, chatRoomsCollection, roomId, messagesCollection), {
        senderName: currentUser?.displayName, 
        text: message,
        timestamp: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error sending message:', error);
      alert('An error occurred while sending the message. Please try again later.');
    }
  };


  return (
    <Container maxWidth="sm">
      <Typography sx={{ m: 2 }} variant="h4" component="h1" gutterBottom>
        Your Chat Rooms
      </Typography>

      {chatRooms.length === 0 ? (
        <Typography variant="body1">You haven't created any chat rooms yet.</Typography>
      ) : (
        <List>
          {chatRooms.map((room) => (
            <ListItem key={room.id} component={Link} to={`/chat/${room.id}`}>
              <RoomIcon />
              <ListItemText primary={room.name} secondary={room.description} />
              <ListItemSecondaryAction>
                <CopyToClipboard text={window.location.origin + `/chat/${room.id}`}>
                  <IconButton edge="end" aria-label="copy" onClick={() => alertSnackbar('Copied!')}>
                    <CopyIcon />
                  </IconButton>
                </CopyToClipboard>
                <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteChatRoom(room.id)}>
                  <DeleteIcon />
                </IconButton> 
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      )}

      <Button sx={{ m: 2 }} variant="contained" color="primary" onClick={goCreatChatRoom}>
        Create Chat Room
      </Button>

      <Notification open={openNotification} onClose={() => setOpenNotification(false)} message={notificationMessage} />

    </Container>
  );
};

export default DashboardPage;
