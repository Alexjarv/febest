import React, {useContext, useState} from 'react';
import {Link} from 'react-router-dom';
import {
    AppBar,
    Toolbar,
    IconButton,
    Box,
    Button,
    Drawer,
    List,
    ListItem,
    Typography,
    ListItemText,
    ListItemIcon,
    makeStyles,
} from '@material-ui/core';
import {Menu as MenuIcon, List as ListIcon, Label as LabelIcon} from '@material-ui/icons';
import {BlogContext} from "../contexts/BlogContextProvider";

const useStyles = makeStyles((theme) => ({
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
}));

export default function Navigation() {

    const classes = useStyles();
    const context = useContext(BlogContext);

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" className={classes.title}>
                    {context.isAuthenticated ? context.user.username : "Guest" }
                </Typography>

                {context.isAuthenticated === 'true' ? (
                        <Button href="/logout" color="inherit">Logout</Button>
                    ) : (
                        <Button href="/login" color="inherit">Login</Button>
                    )}

            </Toolbar>
        </AppBar>
    );
};
