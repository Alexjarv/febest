import React, {Fragment, useContext, useState} from 'react';
import {BlogContext} from '../contexts/BlogContextProvider';
import {
    Avatar,
    Box, Card, CardActions, CardContent, CardHeader, CardMedia, Collapse, Divider, Grid,
    IconButton, Link, ListItemIcon, ListItemText,
    makeStyles, Menu, MenuItem,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Typography, withStyles
} from "@material-ui/core";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import FavoriteIcon from '@material-ui/icons/Favorite';
import CommentIcon from '@material-ui/icons/Comment';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {red} from "@material-ui/core/colors";
import {NavLink} from "react-router-dom";
import DeleteDialog from "./DeleteDialog";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import Comments from "./Comments";
import AddIcon from "@material-ui/icons/Add";


const useStyles = makeStyles((theme) => ({
    heading: {
        marginBottom: "15px",
    }
}));

const GridMargin = withStyles({
    root: {
        marginTop: "25px"
    }
})(Grid);

export default function NewPost() {

    const context = useContext(BlogContext);
    const [addPostContent, setAddPostContent] = useState('');
    const [addPostTitle, setAddPostTitle] = useState('');
    const classes = useStyles();

    const onCreateSubmit = (event) => {
        event.preventDefault();
        context.createPost(event, {title: addPostTitle, content: addPostContent});
        setAddPostTitle('');
        setAddPostContent('');
    };

    return (
        <GridMargin container item xs={12} md={8} spacing={3} >
            <Grid item xs={12}>
                <h3 className={classes.heading}>Add New Post</h3>
                <form onSubmit={onCreateSubmit}>
                    <TextField variant="outlined"
                               size="small"
                               type="text"
                               value={addPostTitle}
                               onChange={(event) => {
                                   setAddPostTitle(event.target.value);
                               }}
                               label="Title"
                               fullWidth={true}
                               multiline={true}/>
                    <TextField variant="outlined"
                               size="small"
                               type="text"
                               rows={1}
                               rowsMax={24}
                               multiline
                               value={addPostContent}
                               onChange={(event) => {
                                   setAddPostContent(event.target.value);
                               }}
                               label="Content"
                               fullWidth={true}
                               multiline={true}/>
                    <IconButton color="primary" onClick={onCreateSubmit}>
                        <AddIcon/>
                    </IconButton>
                </form>
            </Grid>
        </GridMargin>
    );
}