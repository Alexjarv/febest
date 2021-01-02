//REACT
import React, {useContext, useState} from 'react';
import {BlogContext} from '../contexts/BlogContextProvider';
import {Snackbar, useTheme} from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';


function AppSnackbar(props) {
    const context = useContext(BlogContext);
    const {text, level} = context.message;

    const handleClose = (event) => {
        event.preventDefault();
        context.setMessage({});
    };

    return (
        <Snackbar color="primary" autoHideDuration={3000} open={context.message.text !== undefined} onClose={() => context.setMessage({})}>
            <MuiAlert variant="filled" onClose={() => context.setMessage({})}
                      severity={level === 'success' ? 'success' : 'warning'}>{text}</MuiAlert>
        </Snackbar>
    );
}

export default AppSnackbar;