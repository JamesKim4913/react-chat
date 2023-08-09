// pages/ChatRoomPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, TextField, Button, Grid, Avatar, Box, Paper, List, ListItem, ListItemText } from '@mui/material';
import {
  collection,
  doc,
  query,
  where,
  orderBy, 
  limit, 
  onSnapshot,
  getDocs, 
  getDoc, 
  addDoc,
  serverTimestamp,
  setDoc,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '../firebase/config.js'; 
import { chatRoomsCollection, messagesCollection, userPinsCollection, pinnedRoomsCollection } from '../constants/constants.js';
import { useAuth  } from '../contexts/authContext'; 
import SendIcon from '@mui/icons-material/Send';
import RoomIcon from '@mui/icons-material/Room';
import { styled } from "@mui/material/styles";
import Notification from '../components/Notification';
import { ListItemSecondaryAction, IconButton } from '@mui/material';
import useLocalStorage from '../hooks/useLocalStorage';


const ChatContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  display: "flex",
  flexDirection: "column",
  height: "100%",
}));

const ChatMessage = styled("div")(({ senderName, currentUser, theme }) => ({
  display: "flex",
  alignItems: "center",
  marginBottom: theme.spacing(1),
  marginLeft: senderName === currentUser ? "auto" : 0, // Align sender's messages to the right
  backgroundColor: senderName === currentUser ? "#e1f5fe" : "#f5f5f5",
}));

const TimeStamp = styled(Typography)(({ theme }) => ({
  fontSize: "0.8rem",
  color: theme.palette.text.secondary,
  marginLeft: "8px",
}));

const ResponsiveGridContainer = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
  },
}));


const ChatRoomPage = () => {
  const { roomId } = useParams(); 
  // Use the useAuth hook to get the currentUser
  const { currentUser } = useAuth(); 
  // State to hold the password input value
  const [password, setPassword] = useState('');
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');  
  // State to hold any error message
  const [errorMessage, setErrorMessage] = useState('');
  // State to hold the chat room data
  const [chatRoomData, setChatRoomData] = useState(null);
  // State to manage whether the rooom is public or not
  const [isPrivate, setIsPrivate] = useState(false);
  // Set a senderName
  const [senderName, setSenderName] = useLocalStorage('nickname', ''); // 'nickname' is the key
  const [openNotification, setOpenNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [isPinned, setIsPinned] = useState(false);
  const [chatRoomName, setChatRoomName] = useState('');

  // Fetch the chat room document from Firestore
  const getChatRoomByRoomId = async (roomId) => {
    try {
      const chatRoomDocRef = doc(db, chatRoomsCollection, roomId);
      const chatRoomSnapshot = await getDoc(chatRoomDocRef);
  
      if (!chatRoomSnapshot.exists()) {        
        return { success: false, errorMessage: 'Invalid room ID' };
      } else {
        const chatRoomData = chatRoomSnapshot.data();        
        return { success: true, chatRoomData };
      }
    } catch (error) {
      console.error('Error querying chat room:', error);
      return { success: false, errorMessage: 'Error querying chat room' };
    }
  };

  // Handle password input change
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setErrorMessage(''); // Clear the error message when the password is changed
  };
 
  const handleJoinChatRoom = () => {
    // Check if the password matches the chat room's password
    if (password === chatRoomData?.password) {
      // Implement the logic to join the chat room
      setIsPrivate(false);
    } else {
      // Password is incorrect, show an error message or alert
      setErrorMessage('Invalid password');
    }
  };

  // Fetch the chat room data using the roomId
  const fetchChatRoomData = async () => {
    try {
      // Fetch the chat room information using the provided roomId
      const { success, chatRoomData, errorMessage } = await getChatRoomByRoomId(roomId);
      // Set chatRoomName
      setChatRoomName(chatRoomData.name || '');

      if (success && chatRoomData.isPrivate) {
        // If the chat room requires a password
        setChatRoomData(chatRoomData);
        setIsPrivate(true);         
      } else if (success && !chatRoomData.isPrivate) {
        // If the chat room does not require a password
        setChatRoomData(chatRoomData);
        setIsPrivate(false); 
      } else {
        // If there was an error or the chat room doesn't exist
        setErrorMessage(errorMessage);
      }
    } catch (error) {
      console.error('Error querying chat room:', error);
      setErrorMessage('Error querying chat room');
    }
  };

  // Set up a Firestore listener to detect real-time changes in the chatroom messages   
  const unsubscribe1 = onSnapshot(
    query(collection(db, chatRoomsCollection, roomId, messagesCollection), orderBy('timestamp'), limit(50)),
    (snapshot) => {
      const messageData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setMessages(messageData);
    }
  );

  useEffect(() => {      
    // Call the fetchChatRoomData function when the component mounts
    fetchChatRoomData(); 
 
    // Call listener
    unsubscribe1();    

    if (currentUser) {
      // Set default nickname
      setSenderName(currentUser?.displayName);

      // Check if the chat room is pinned by the current user
      const userPinsRef = doc(db, userPinsCollection, currentUser.uid);
      const pinnedRoomsQuery = query(collection(userPinsRef, pinnedRoomsCollection), where('roomId', '==', roomId));

      const unsubscribe2 = onSnapshot(pinnedRoomsQuery, (snapshot) => {
        setIsPinned(!snapshot.empty); // Update isPinned based on whether the chat room is in the pinnedRooms subcollection
      });
      return () => unsubscribe2();
    } else {
      // Load the pinned chat rooms from local storage for non-logged-in users
      const pinnedRooms = JSON.parse(localStorage.getItem(pinnedRoomsCollection) || '[]');      
      const isRoomPinned = pinnedRooms.some((room) => room.roomId === roomId);
      setIsPinned(isRoomPinned);
    }

    // Unsubscribe the listener when the component unmounts
    return () => {
      unsubscribe1();
    };
  }, [currentUser, roomId]);

  // Set senderName
  const handleSenderNameChange = (event) => {
    const newNickname = event.target.value;
    setSenderName(newNickname);
  }

  // Send message
  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (currentUser?.displayName.trim() === "" || senderName.trim() === "" || newMessage.trim() === "") {
      setOpenNotification(true);
      setNotificationMessage('Please enter your nickname or message');           
      setTimeout(() => {
          setOpenNotification(false);                
      }, [2000]);
      return;
    }

    try {     
      // Save the new message to Firestore
      await addDoc(collection(db, chatRoomsCollection, roomId, messagesCollection), {
        senderName: currentUser?.displayName || senderName, // Use the name of the sender if logged in, otherwise set as senderName  
        text: newMessage,
        timestamp: serverTimestamp(),
      });

      // Clear the input field after sending the message
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('An error occurred while sending the message. Please try again later.');
    }
  };

  const handlePinChatRoom = async () => {
    if (currentUser) {
      // Pin or unpin the chat room based on its current status
      const userPinsRef = doc(db, userPinsCollection, currentUser.uid);
      const pinnedRoomsRef = collection(userPinsRef, pinnedRoomsCollection);
  
      // Check if the chat room is already pinned
      const pinnedRoomQuery = query(pinnedRoomsRef, where('roomId', '==', roomId));
      const pinnedRoomSnapshot = await getDocs(pinnedRoomQuery);
  
      if (!pinnedRoomSnapshot.empty) {
        // Unpin the chat room
        const pinnedRoomDoc = pinnedRoomSnapshot.docs[0];
        await deleteDoc(pinnedRoomDoc.ref);
      } else {
        // Get the chat room name
        const chatRoomDoc = await getDoc(doc(db, chatRoomsCollection, roomId));
        const chatRoomName = chatRoomDoc.exists() ? chatRoomDoc.data().name : '';
  
        // Pin the chat room with roomId and chat room name
        await setDoc(doc(pinnedRoomsRef, roomId), {
          roomId,
          chatRoomName,
          timestamp: serverTimestamp(),
        });
      }
    } else {
      // For non-logged-in users, store pinned rooms in local storage
      const pinnedRooms = JSON.parse(localStorage.getItem(pinnedRoomsCollection) || '[]');
      const isRoomPinned = pinnedRooms.some((room) => room.roomId === roomId);

      if (isRoomPinned) {
        // Unpin the chat room
        const updatedPinnedRooms = pinnedRooms.filter((room) => room.roomId !== roomId);
        localStorage.setItem(pinnedRoomsCollection, JSON.stringify(updatedPinnedRooms));
      } else {
        // Pin the chat room
        // Add the new chat room to pinnedRooms array
        pinnedRooms.push({ roomId, chatRoomName });
        localStorage.setItem(pinnedRoomsCollection, JSON.stringify(pinnedRooms));
      }
      setIsPinned(!isRoomPinned); 
    }
  };  

  return (
    <ChatContainer>

      <Container maxWidth="sm" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h5">Chat Room: {chatRoomData?.name}</Typography>        
        {/* Pin/Unpin button */} 
        <IconButton onClick={handlePinChatRoom} aria-label="pin">
        {isPinned ? <RoomIcon color="primary" /> : <RoomIcon />}
        </IconButton>
        {isPinned ? <Typography variant="body1">Pinned</Typography> : <Typography variant="body1">Not Pinned</Typography>}  
      </Container>   

      <Box mt={2} />

      {isPrivate ? (  // when private chat rooms only, need to password input
        <>
          <Typography variant="body1">This is a private chat room. Enter the password to join:</Typography>
          <Grid container spacing={2} alignItems="center" sx={{ mt: 2 }}>
            <Grid item xs={12} sm={3}>
              <TextField
                type="password"
                value={password}
                onChange={handlePasswordChange} // Use the handlePasswordChange function here                   
                placeholder="Password"
                variant="outlined"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <Button sx={{ height: '55px' }} variant="contained" color="primary" fullWidth onClick={handleJoinChatRoom}>
                Join Chat Room
              </Button>
            </Grid>
          </Grid>              
          {errorMessage && <p>{errorMessage}</p>}
        </>
      ) : (  // when public chat rooms
        <>
          <Box flexGrow={1} display="flex" flexDirection="column">
            {messages.map((message, index) => (
              <ChatMessage
                key={index}
                senderName={message.senderName}
                currentUser={currentUser?.displayName || senderName}
              >
                {message.senderName !== (currentUser?.displayName || senderName) && (
                  <Avatar>{message.senderName.charAt(0)}</Avatar>
                )} 

                <div>
                  <Typography variant="body1" component="p">{message.text}</Typography>
                  <TimeStamp>
                    {new Date(message.timestamp?.toDate()).toLocaleString()}
                  </TimeStamp>
                </div>              
              </ChatMessage>
            ))}
          </Box>

          <Box mt={6} />

          <ResponsiveGridContainer container spacing={2}>
            <Grid item xs={12} sm={3}>
              <TextField
                variant="outlined"
                fullWidth
                label="Nickname" 
                value={senderName}
                onChange={handleSenderNameChange}              
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                fullWidth
                label="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
               {/* Send button */}
              <Button 
                sx={{ height: '55px' }} 
                variant="contained" 
                color="primary" 
                onClick={handleSendMessage} 
                fullWidth 
                endIcon={<SendIcon />}
              >
                Send
              </Button> 
            </Grid>            
          </ResponsiveGridContainer>                             
        </>
      )}  

      {/* Snackbar to display the notification */}
      <Notification open={openNotification} onClose={() => setOpenNotification(false)} message={notificationMessage} />

    </ChatContainer>
   
  );

}


export default ChatRoomPage;
