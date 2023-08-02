// components/Notification.jsx
import React from 'react';
import Snackbar from '@mui/material/Snackbar';
// import MuiAlert from '@mui/material/Alert';
// import { Snackbar } from '@mui/material'
// import React, { useState } from 'react';
import PropTypes from 'prop-types';

const Notification = ({ open, onClose, message }) => {   
    return (
        <Snackbar
            open={open}
            autoHideDuration={2000}   
            onClose={onClose}         
            message={message}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        />

        // <Snackbar open={open} autoHideDuration={2000} onClose={onClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        //     <MuiAlert onClose={onClose} severity="success" elevation={6} variant="filled">
        //         {message}
        //     </MuiAlert>
        // </Snackbar>
    )
}

Notification.propTypes = {
    open: PropTypes.bool.isRequired, // Ensure open prop is a boolean
    message: PropTypes.string.isRequired, // Ensure message prop is a string
};

  
export default Notification;