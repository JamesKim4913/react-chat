// pages/CreateChatRoomPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormControlLabel, Checkbox, Typography, Container, TextField, Button, Box } from '@mui/material';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config.js'; 
import { chatRoomsCollection } from '../constants/constants.js'; // Import the chatRoomsCollection constant
import { useAuth  } from '../contexts/authContext';


const CreateChatRoomPage = () => {
  const [roomName, setRoomName] = useState('');
  const [roomDescription, setRoomDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  // Check if the user is logged in
  if (!currentUser) {
    alert("Please log in to create a chat room.");
    const timeout = setTimeout(() => navigate('/signin'), 100);
    return () => {
      clearTimeout(timeout);
    };      
  }  

  const handleCreateRoom = async () => {
    if (roomName.trim() === '') {
      alert('Please enter a valid room name.');
      return;
    }    

    try {
      // Save the chat room data to Firestore
      await addDoc(collection(db, chatRoomsCollection), {
        name: roomName,
        description: roomDescription,
        isPrivate,
        password: isPrivate ? password : '', // Only include the password if the chat room is private    
        createdBy: currentUser?.email, // logged-in user email
        //createdBy: user?.email, // logged-in user email
        createdAt: serverTimestamp(),
      });

      // After the room is created, navigate to the dashboard page
      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating chat room:', error);
      alert('An error occurred while creating the chat room. Please try again later.');
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography sx={{ m: 2 }} variant="h4" component="h1" align="center" gutterBottom>
        Create a New Chat Room
      </Typography>
     
        <TextField
          label="Chat Room Name"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          required
          fullWidth
        />
        <Box mt={2} />
        <TextField
          label="Chat Room Description"
          value={roomDescription}
          onChange={(e) => setRoomDescription(e.target.value)}
          required
          fullWidth
          multiline
          rows={4}
        />

        <FormControlLabel
          control={<Checkbox checked={isPrivate} onChange={(e) => setIsPrivate(e.target.checked)} />}
          label="Private Chat Room"
        />
        {isPrivate && (
          <TextField
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
            type="password"
          />
        )}

        <Box mt={2} />
        <Button          
          sx={{ mt: 1 }} 
          variant="contained" 
          color="primary" 
          fullWidth 
          onClick={handleCreateRoom}
        >
          Create Chat Room
        </Button>
     
    </Container>
  );
};

export default CreateChatRoomPage;
