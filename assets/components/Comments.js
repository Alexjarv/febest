import React, {Fragment, useContext, useState} from 'react';
import {BlogContext} from '../contexts/BlogContextProvider';
import {
    Avatar,
    Box, Card, CardActions, CardContent, CardHeader, CardMedia, Collapse, Divider, Fade, Grid,
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
import AddIcon from '@material-ui/icons/Add';
import {red} from "@material-ui/core/colors";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import {NavLink} from "react-router-dom";
import FavoriteIcon from "@material-ui/icons/Favorite";
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import DeleteIcon from "@material-ui/icons/Delete";
import SendIcon from "@material-ui/icons/Send";
import Button from "@material-ui/core/Button";
import DeleteDialog from "./DeleteDialog";


const useStyles = makeStyles(() => ({
    root: {

    },
    noBox: {
        boxShadow: "unset"
    },
    Box: {
        boxShadow: "0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)"
    },
    commentHeader: {
        padding: "10px"
    },
    formPadding:{
        marginTop: "15px",
        marginBottom: "15px"
    },
    flex: {
        display: "flex"
    },
    IconNumber: {
        fontSize: "20px",
        marginRight: "5px"
    },
    smallText: {
        fontSize: "20px"
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
    right: {
        marginLeft: 'auto'
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    avatar: {
        backgroundColor: red[500],
    },
}));
withStyles({
    root: {
        marginTop: "25px"
    }
})(Divider);
withStyles({
    root: {
        marginTop: "25px"
    }
})(Grid);

export default function Comments() {

    const context = useContext(BlogContext);
    const classes = useStyles();
    const [deleteConfirmationIsShown, setDeleteConfirmationIsShown] = useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [commentToBeDeleted, setCommentToBeDeleted] = useState(null);
    const [OpenedMenuId, setOpenedMenuId] = React.useState(null);
    const [addCommentContent, setAddCommentContent] = useState('');


    const handleClose = () => {
        setAnchorEl(null);
        setOpenedMenuId(null);
    };

    const onCreateSubmit = (event) => {
        event.preventDefault();
        const postId = context.post.id;
        context.createComment(event, {content: addCommentContent, post_id: postId});
        setAddCommentContent('');
    };

    const onHideComment = (event, comment_id) => {
        event.preventDefault();
        context.hideComment({comment_id: comment_id});
        setAnchorEl(null);
        setOpenedMenuId(null);
    };

    return (
            <Grid className={classes.Box} item xs={12}>
                <h3>Comments {context.post.comments}</h3>
                <form onSubmit={onCreateSubmit}>
                    <TextField
                               size="small"
                               type="text"
                               rows={1}
                               rowsMax={24}
                               multiline
                               className={classes.formPadding}
                               value={addCommentContent}
                               onChange={(event) => {
                                   setAddCommentContent(event.target.value);
                               }}
                               label="New comment"
                               fullWidth={true}/>
                    <Button
                        variant="contained"
                        color="primary"
                        className={classes.button}
                        onClick={onCreateSubmit}
                        endIcon={<SendIcon/>}
                    >Send</Button>
                </form>

                {context.comments.slice().reverse().map((comment, index) => (
                    {...(comment.isHidden !== 1 ?
                            <Card key={comment.id} className={classes.noBox}>
                                <CardHeader
                                    className={classes.commentHeader}
                                    avatar={
                                        <Avatar aria-label="recipe" className={classes.avatar}>
                                            A
                                        </Avatar>
                                    }
                                    action={
                                        //If you are an admin you will see the corner menu
                                        {... (context.user.isSuperuser === 1 ?
                                        <Box>
                                            <IconButton aria-controls="settings" aria-haspopup="true" onClick={(event) => {
                                                if(OpenedMenuId !== comment.id){
                                                    setOpenedMenuId(comment.id);
                                                } else {
                                                    setOpenedMenuId(null);
                                                }
                                                setAnchorEl(event.currentTarget);
                                            }}>
                                                <MoreVertIcon/>
                                            </IconButton>
                                            <Menu
                                                id={`menu-${index}`}
                                                anchorEl={anchorEl}
                                                keepMounted
                                                open={OpenedMenuId === comment.id}
                                                onClose={handleClose}
                                                TransitionComponent={Fade}
                                            >
                                                <MenuItem id={`MenuItem1-${index}`} onClick={(event) => {
                                                    onHideComment(event, comment.id);
                                                }}>
                                                    <ListItemIcon>
                                                        <VisibilityOffIcon/>
                                                    </ListItemIcon>
                                                    <ListItemText primary="Hide" />
                                                </MenuItem>
                                                <MenuItem id={`MenuItem2-${index}`} onClick={() => {
                                                    setDeleteConfirmationIsShown(true);
                                                    setCommentToBeDeleted(comment);
                                                    setAnchorEl(null);
                                                    setOpenedMenuId(null);
                                                }}>
                                                    <ListItemIcon>
                                                        <DeleteIcon/>
                                                    </ListItemIcon>
                                                    <ListItemText primary="Delete" />
                                                </MenuItem>
                                            </Menu>
                                        </Box>
                                                : <Box></Box>)}
                                    }
                                    titleTypographyProps={{variant:'h6' }}
                                    title={<NavLink to={`/user/1}`}>Anon</NavLink>}

                                    subheader={comment.created_at}
                                />
                                <CardContent>
                                    <Typography variant="body2" component="p">
                                        {comment.content}
                                    </Typography>
                                </CardContent>
                                <CardActions disableSpacing>
                                    <IconButton aria-label="add to favorites">
                                        {comment.likes !== 0 && <Box className={classes.IconNumber} component="div" m={1}>{comment.likes}</Box>}
                                        <Link className={classes.flex} color="inherit"><FavoriteIcon /></Link>
                                    </IconButton>
                                </CardActions>
                            </Card>
                        :
                                <Card key={comment.id} className={classes.noBox}>
                                    <CardHeader
                                        className={classes.commentHeader}
                                        avatar={
                                            <Avatar aria-label="recipe" className={classes.avatar}>
                                                A
                                            </Avatar>
                                        }
                                        action={
                                            //If you are an admin you will see the corner menu
                                            {... (context.user.isSuperuser === 1 ?
                                                    <Box>
                                                        <IconButton aria-controls="settings" aria-haspopup="true" onClick={(event) => {
                                                            if(OpenedMenuId !== comment.id){
                                                                setOpenedMenuId(comment.id);
                                                            } else {
                                                                setOpenedMenuId(null);
                                                            }
                                                            setAnchorEl(event.currentTarget);
                                                        }}>
                                                            <MoreVertIcon/>
                                                        </IconButton>
                                                        <Menu
                                                            id={`menu-${index}`}
                                                            anchorEl={anchorEl}
                                                            keepMounted
                                                            open={OpenedMenuId === comment.id}
                                                            onClose={handleClose}
                                                            TransitionComponent={Fade}
                                                        >
                                                            <MenuItem id={`MenuItem1-${index}`} onClick={(event) => {
                                                                onHideComment(event, comment.id);
                                                            }}>
                                                                <ListItemIcon>
                                                                    <VisibilityOffIcon/>
                                                                </ListItemIcon>
                                                                <ListItemText primary="Hide" />
                                                            </MenuItem>
                                                            <MenuItem id={`MenuItem2-${index}`} onClick={() => {
                                                                setDeleteConfirmationIsShown(true);
                                                                setCommentToBeDeleted(comment);
                                                                setAnchorEl(null);
                                                                setOpenedMenuId(null);
                                                            }}>
                                                                <ListItemIcon>
                                                                    <DeleteIcon/>
                                                                </ListItemIcon>
                                                                <ListItemText primary="Delete" />
                                                            </MenuItem>
                                                        </Menu>
                                                    </Box>
                                                    : <Box></Box>)}
                                        }
                                        titleTypographyProps={{variant:'h6' }}
                                        title={<NavLink to={`/user/1}`}>Anon</NavLink>}

                                        subheader={comment.created_at}
                                    />
                                    <CardContent>
                                        <Typography variant="body2" color="inherit" component="p">
                                            Comment is hidden <VisibilityOffIcon/>
                                        </Typography>
                                    </CardContent>
                                </Card>
                        )}
                    ))}

                {deleteConfirmationIsShown && (
                    <DeleteDialog comment={commentToBeDeleted}
                                  open={deleteConfirmationIsShown}
                                  setDeleteConfirmationIsShown={setDeleteConfirmationIsShown}
                    />
                )}
            </Grid>
    );
}