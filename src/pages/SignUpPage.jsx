// pages/SignUpPage.jsx
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import { createUserWithEmailAndPassword, signInWithPopup, AuthErrorCodes } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { auth, googleProvider, facebookProvider } from '../firebase/config';
import Notification from '../components/Notification';
import { useNavigate } from 'react-router-dom';
import { getAuthErrorCode } from '../utils/util';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import useLocalStorage from '../hooks/useLocalStorage';


const defaultTheme = createTheme();

export default function SignUp() {
    const [openNotification, setOpenNotification] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');
    const navigate = useNavigate();   
    const [user, setUser] = useLocalStorage('user', null);
    const [userInfo, setUserInfo] = useState({      
      email: '',
      password: '',
    });

    const handleChange = (event) => {
      const { name, value } = event.target;
      setUserInfo((prevInputValue) => ({
        ...prevInputValue,
        [name]: value,
      }));
    };    

    // Google
    const handleSignUpWithGoogle = () => {
        signInWithPopup(auth, googleProvider).then((response) => {            
            setOpenNotification(true);
            setNotificationMessage('Your Account is created');
            setUser(response.user);
            setTimeout(() => {
                setOpenNotification(false);
                navigate('/dashboard');
            }, [2000])
        }).catch((error) => {
            setOpenNotification(true);
            const errorMessage = getAuthErrorCode(error.code);
            setNotificationMessage(errorMessage);
            setTimeout(() => {
                setOpenNotification(false);
            }, [2000])
        })
    }
 
    // Facebook
    const handleSignUpWithFacebook = () => {      
      signInWithPopup(auth, facebookProvider).then((response) => {                 
          setOpenNotification(true);
          setNotificationMessage('Your Account is created');
          setUser(response.user);
          setTimeout(() => {
              setOpenNotification(false);
              navigate('/dashboard');
          }, [2000]) 
      }).catch((error) => {        
          setOpenNotification(true);
          const errorMessage = getAuthErrorCode(error.code);
          setNotificationMessage(errorMessage);
          setTimeout(() => {
              setOpenNotification(false);
          }, [2000]) 
      })
    }   

    // Email and Password
    const handleSignUpWithEmailAndPassword = () => {
        createUserWithEmailAndPassword(auth, userInfo.email, userInfo.password).then((response) => {          
            setOpenNotification(true);
            setNotificationMessage('Your Account is created');
            setUser(response.user);
            setTimeout(() => {
                setOpenNotification(false);
                navigate('/dashboard');
            }, [2000])
        }).catch((error) => {
            setOpenNotification(true);
            const errorMessage = getAuthErrorCode(error.code);
            setNotificationMessage(errorMessage);
            setTimeout(() => {
                setOpenNotification(false);
            }, [2000])
        })
    }

    return (
      <ThemeProvider theme={defaultTheme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign up
            </Typography>

            <Divider 
              sx={{
              marginTop: 2,
            }} />
            <Button variant="contained"  onClick={handleSignUpWithGoogle}>
              <GoogleIcon /> Sign Up With Google
            </Button>
           
            <Divider 
              sx={{
              marginTop: 2,
            }}>OR</Divider>

            <Box noValidate sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                type='text'
                autoFocus
                value={userInfo.email === null ? '' : userInfo.email}               
                onChange={handleChange}
              />
              <TextField  
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"               
                value={userInfo.password === null ? '' : userInfo.password}
                onChange={handleChange}
              />              
              <Button                
                fullWidth
                variant="contained"
                sx={{ mt: 1, mb: 1 }}
                onClick={handleSignUpWithEmailAndPassword}
              >
                Sign Up
              </Button> 

              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link href="/signin" variant="body2">
                    Already have an account? Sign in
                  </Link>
                </Grid>
              </Grid>

            </Box>
          </Box>  

          {/* Snackbar to display the notification */}
          <Notification open={openNotification} onClose={() => setOpenNotification(false)} message={notificationMessage} />

        </Container>
      </ThemeProvider>
    );
}