// components/Notification.jsx
import React from 'react';
import Snackbar from '@mui/material/Snackbar';
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
    )
}

Notification.propTypes = {
    open: PropTypes.bool.isRequired, // Ensure open prop is a boolean
    message: PropTypes.string.isRequired, // Ensure message prop is a string
};

  
export default Notification;