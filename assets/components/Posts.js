import React, {Fragment, useContext, useState} from 'react';
import {BlogContext} from '../contexts/BlogContextProvider';
import {
    Box, Button, Divider, Grid,
    IconButton,
    makeStyles,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Typography, withStyles
} from "@material-ui/core";


const useStyles = makeStyles(theme => ({
    thead: {
        backgroundColor: theme.palette.primary.main,
    },
}));


const LightGreyTextTypography = withStyles({
    root: {
        color: "#c9c9cc"
    }
})(Typography);

const GreyTextTypography = withStyles({
    root: {
        color: "#6e6d7a"
    }
})(Typography);

const MarginDivider = withStyles({
    root: {
        marginTop: "25px"
    }
})(Divider);

const GridMargin = withStyles({
    root: {
        marginTop: "25px"
    }
})(Grid);

export default function Posts() {

    const context = useContext(BlogContext);

    const classes = useStyles();

    const onCreateSubmit = (event) => {
        event.preventDefault();
    };

    const onEditSubmit = (postId, event) => {
        event.preventDefault();
    };

    return (
            <GridMargin container item xs={12} md={8} spacing={3} >
                {context.posts.slice().reverse().map((post, index) => (
                    <Grid item xs={12} key={'post' + index}>
                        <Box >
                            <Typography variant="h5" gutterBottom>{post.title}</Typography>
                            <LightGreyTextTypography variant="subtitle2" gutterBottom>{post.created_at}</LightGreyTextTypography>
                            <GreyTextTypography variant="body1" style={{whiteSpace: 'pre-wrap'}}>{post.excerpt}</GreyTextTypography>
                        </Box>
                        <MarginDivider/>
                    </Grid>
                    ))}
            </GridMargin>
    );
}