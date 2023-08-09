// pages/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth  } from '../contexts/authContext'; 
import { storage } from '../firebase/config.js'; 
import { updateProfile } from "firebase/auth";
import { getStorage, ref, uploadBytesResumable, uploadBytes, getDownloadURL } from "firebase/storage";
import { Avatar, Button, TextField } from "@mui/material";
import { useNavigate } from 'react-router-dom';


const ProfilePage = () => {
  const { currentUser } = useAuth();
  const [nickname, setNickname] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [photoURL, setPhotoURL] = useState(null);
  const [progress, setProgress] = useState(0);
  const [selectedFileName, setSelectedFileName] = useState("");
  const navigate = useNavigate(); 

  useEffect(() => {    
    if(currentUser) {
      // Set the initial nickname when the component mounts
      setNickname(currentUser.displayName || '');
      // Set profile image url
      setPhotoURL(currentUser.photoURL || '');
    } else {
      alert("To set up a profile, please log in first.");
      const timeout = setTimeout(() => navigate('/signin'), 100);
      return () => {
        clearTimeout(timeout);
      }; 
    } 
  }, [currentUser]); 

  const handleNicknameChange = (e) => {
    setNickname(e.target.value);
  };

  const handleProfileImageChange = (e) => {
    if (e.target.files[0]) {
        setProfileImage(e.target.files[0]);
        setSelectedFileName(e.target.files[0].name);
    }    
  };

  const handleUpdateProfile = () => {
    // Update the display name
    updateProfile(currentUser, {
      displayName: nickname,
    })
      .then(() => {
        console.log("User display name updated successfully!");
      })
      .catch((error) => {
        console.error("Error updating user display name: ", error);
      });

    // Upload profile image and update photoURL
    if (profileImage) {
      const storageRef = ref(storage, `profileImages/${currentUser.uid}`);
      const uploadTask = uploadBytesResumable(storageRef, profileImage);

      // Listen for state changes, including progress updates
      uploadTask.on("state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );  
          setProgress(progress);        
        },
        (error) => {
          console.error("Error uploading image: ", error);
        },
        () => {
          console.log("Uploaded a blob or file");

          // Get the download URL of the uploaded image
          getDownloadURL(storageRef)
            .then((url) => {
              // Update the photoURL state with the download URL
              setPhotoURL(url);

              // Update the photoURL field in the user's profile
              updateProfile(currentUser, {
                photoURL: url,
              })
                .then(() => {
                  console.log("User profile image URL updated successfully!");
                })
                .catch((error) => {
                  console.error("Error updating user profile image URL: ", error);
                });
            })
            .catch((error) => {
              console.error("Error getting download URL: ", error);
            });
        }
      );
    }
  };

  const styles = {
    root: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    avatar: {
      width: "100px",
      height: "100px",
      marginBottom: "20px",
    },
    form: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    input: {
      display: "none",
    },
    uploadButton: {
      marginTop: "10px",
    },
    saveButton: {
      marginTop: "20px",
    },
    progressBar: {
      width: "100%",
      marginTop: "10px",
    },
    fileNameDisplay: {
      margin: "10px 0",
      fontWeight: "bold",
    },    
  };  

  return (
    <div style={styles.root}>
      <Avatar alt={nickname} src={photoURL} style={styles.avatar} />

      <form style={styles.form}>
        <TextField
          label="Nickname"
          value={nickname}
          onChange={handleNicknameChange}
          variant="outlined"
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleProfileImageChange}
          id="profile-image-input"
          style={styles.input}
        />
        <label htmlFor="profile-image-input">
          <Button component="span" variant="contained" color="primary" style={styles.uploadButton}>
            Upload Profile Image
          </Button>
        </label>
        {selectedFileName && (
          <div style={styles.fileNameDisplay}>Selected File: {selectedFileName}</div>
        )}
        <Button onClick={handleUpdateProfile} variant="contained" color="primary" style={styles.saveButton}>
          Save Profile
        </Button>
      </form>

      {progress > 0 && <progress value={progress} max="100" style={styles.progressBar} />}
    </div>
  );  

};

export default ProfilePage;
