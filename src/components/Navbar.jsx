// components/Navbar.jsx
import React, { useEffect, useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/config';
import Notification from './Notification';
import { useNavigate, Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import ChatIcon from '@mui/icons-material/Chat';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import AdbIcon from '@mui/icons-material/Adb';
import { pages, settings, getStarted } from '../constants/constants.js';
import { useAuth  } from '../contexts/authContext'; // Import the useAuth hook
import useLocalStorage from '../hooks/useLocalStorage';


export default function Navbar() {
    const navigate = useNavigate();    
    const [openNotification, setOpenNotification] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');  
    const [anchorElNav, setAnchorElNav] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);
    const { currentUser } = useAuth();
    const [user, setUser] = useLocalStorage('user', null);
    const [isLogged, setIsLogged] = useState(false);
    const [displayName, setDisplayName] = useState('');
    const [photoURL, setPhotoURL] = useState(null);

    function checkStorage() {
      if (user) {
        setIsLogged(true);
      } else {
        setIsLogged(false);
      }
    }

    useEffect(() => {
      checkStorage();

      if(currentUser) {
        // Set the displayName
        setDisplayName(currentUser.displayName || '');
        // Set profile image url
        setPhotoURL(currentUser.photoURL || '');
      }     

      return () => {};
    }, [isLogged]);

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleOpenUserMenu = (event) => {
      setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
      setAnchorElUser(null);
    };    

    // Logout 
    const handleLogout = () => {
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
      })
    }

    return (
        <AppBar position="static">
          <Container maxWidth="xl">
            <Toolbar disableGutters>
              <ChatIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />              
              <Typography
                variant="h6"
                noWrap                
                component={Link} 
                to="/"
                sx={{
                  mr: 2,
                  display: { xs: 'none', md: 'flex' },
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  letterSpacing: '.3rem',
                  color: 'inherit',
                  textDecoration: 'none',
                }}
              >
                React-Chat
              </Typography>
    
              <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleOpenNavMenu}
                  color="inherit"
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorElNav}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                  open={Boolean(anchorElNav)}
                  onClose={handleCloseNavMenu}
                  sx={{
                    display: { xs: 'block', md: 'none' },
                  }}
                > 
                  {pages.map((page) => (
                    <MenuItem key={page.value} onClick={handleCloseNavMenu}>
                      <Typography textAlign="center" component={Link} to={page.value}>{page.name}</Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>

              <ChatIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
              <Typography
                variant="h5"
                noWrap
                component={Link} 
                to="/"
                sx={{
                  mr: 2,
                  display: { xs: 'flex', md: 'none' },
                  flexGrow: 1,
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  letterSpacing: '.3rem',
                  color: 'inherit',
                  textDecoration: 'none',
                }}
              >
                React-Chat
              </Typography>
             

              <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                {pages.map((page) => (
                  <Button
                    key={page.value}
                    onClick={handleCloseNavMenu}
                    sx={{ my: 2, color: 'white', display: 'block' }}
                    component={Link} to={page.value}
                  >
                    {page.name}
                  </Button>
                ))}
              </Box>  

              <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt={displayName || ''} src={photoURL || ''} />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {!currentUser ? (  // Non login user
                    getStarted.map((setting) => (
                      <MenuItem key={setting.value} onClick={handleCloseUserMenu}>
                        <Typography textAlign="center" component={Link} to={setting.value}>{setting.name}</Typography>
                      </MenuItem>
                    ))
                  ) : (   // Login user
                    settings.map((setting) => (
                      <MenuItem key={setting.value} onClick={handleCloseUserMenu}>
                        <Typography textAlign="center" component={Link} to={setting.value}>{setting.name}</Typography>
                      </MenuItem>
                    ))
                  )}                 
                </Menu>
              </Box>                          

            </Toolbar>
          </Container>
       

          {/* Snackbar to display the notification */}
          <Notification open={openNotification} onClose={() => setOpenNotification(false)} message={notificationMessage} />

        </AppBar>
    );

}