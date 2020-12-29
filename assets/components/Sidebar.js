import React, {Fragment, useContext, useState} from 'react';
import {BlogContext} from '../contexts/BlogContextProvider';
import {
    Box, Divider,
    Grid,
    Link,
    makeStyles, Typography, withStyles,
} from "@material-ui/core";
import Button from "@material-ui/core/Button";


const useStyles = makeStyles((theme) => ({
    sidebarAboutBox: {
        padding: theme.spacing(2),
        backgroundColor: theme.palette.grey[200],
    },
    sidebarSection: {
        marginTop: theme.spacing(3),
    },
}));

const MarginDivider = withStyles({
    root: {
        marginTop: "25px"
    }
})(Divider);


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
            <Grid container spacing={1}>
                <Grid item xs={12}>
                    <Button fullWidth variant="contained" color="primary" href="/article/new">
                        Add Post
                    </Button>
                </Grid>
            </Grid>
            <MarginDivider/>
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