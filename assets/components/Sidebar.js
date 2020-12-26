import React, {Fragment, useContext, useState} from 'react';
import {BlogContext} from '../contexts/BlogContextProvider';
import {
    Box,
    Grid,
    Link,
    makeStyles, Typography,
} from "@material-ui/core";


const useStyles = makeStyles((theme) => ({
    sidebarAboutBox: {
        padding: theme.spacing(2),
        backgroundColor: theme.palette.grey[200],
    },
    sidebarSection: {
        marginTop: theme.spacing(3),
    },
}));


export default function Sidebar() {

    const context = useContext(BlogContext);

    const classes = useStyles();

    const onCreateSubmit = (event) => {
        event.preventDefault();
    };

    const onEditSubmit = (postId, event) => {
        event.preventDefault();
    };

    return (
        <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom className={classes.sidebarSection}>
                Categories
            </Typography>
            {context.categories.slice().reverse().map((category) => (
                <Link display="block" variant="body1" href={category.url} key={category.title}>
                    {category.title}
                    <Box component="span" m={1} display="inline-block" color="lightgrey">
                        {category.count}
                    </Box>
                </Link>
            ))}
        </Grid>

    );
}