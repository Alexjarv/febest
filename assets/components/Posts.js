import React, {Fragment, useContext, useState} from 'react';
import {BlogContext} from '../contexts/BlogContextProvider';
import {
    Avatar,
    Box, Button, Card, CardActions, CardContent, CardHeader, CardMedia, Collapse, Divider, Fade, Grid,
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
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import CommentIcon from '@material-ui/icons/Comment';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import {red} from "@material-ui/core/colors";
import clsx from "clsx";
import {NavLink} from "react-router-dom";
import DeleteDialog from "./DeleteDialog";
import AddIcon from "@material-ui/icons/Add";


const useStyles = makeStyles((theme) => ({
    root: {

    },
    flex: {
        display: "flex"
    },
    IconNumber: {
        fontSize: "20px",
        marginRight: "5px"
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    avatar: {
        backgroundColor: red[500],
    },
}));

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
    const [deleteConfirmationIsShown, setDeleteConfirmationIsShown] = useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [OpenedMenuId, setOpenedMenuId] = React.useState(null);
    const [postToBeDeleted, setPostToBeDeleted] = useState(null);
    let [TimeOut] = useState(0);
    const [SearchContent, setSearchContent] = useState(null);
    const [expanded, setExpanded] = React.useState(false);
    const [expandedId, setExpandedId] = React.useState(null);


    const handleClose = () => {
        setAnchorEl(null);
        setOpenedMenuId(null);
    };

    const onPostLike = (event, post_id) => {
        event.preventDefault();
        context.likePost({id: post_id});
    };

    const handleSearch = () => {
        if(TimeOut) clearTimeout(TimeOut);
        TimeOut = setTimeout(() => {
            //search function
            if(SearchContent !== ''){
                context.searchPosts({content: SearchContent});
            } else {
                context.readPosts();
            }
        }, 300);
    };

    const onEditSubmit = (postId, event) => {
        event.preventDefault();
    };

    return (
            <GridMargin container item xs={12} md={8} spacing={3} >
                <TextField
                    label="Search"
                    style={{ margin: 8 }}
                    placeholder="Enter post title or post content..."
                    fullWidth
                    onChange={(event) => {
                        setSearchContent(event.target.value);
                        handleSearch();
                    }}
                    variant="outlined"
                    margin="normal"
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                {context.posts.slice().reverse().map((post, index) => (
                    <Grid item xs={12} key={'post ' + index}>
                        <Card className={classes.root}>
                            <CardHeader
                                avatar={
                                    <Avatar aria-label="recipe" className={classes.avatar}>
                                        F
                                    </Avatar>
                                }

                                action={
                                    //If you are an admin you will see the corner menu
                                    {... (context.user.isSuperuser === 1 ?
                                    <Box>
                                        <IconButton aria-controls="settings" aria-haspopup="true" onClick={(event) => {
                                            if(OpenedMenuId !== post.id){
                                                setOpenedMenuId(post.id);
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
                                        open={OpenedMenuId === post.id}
                                        onClose={handleClose}
                                        TransitionComponent={Fade}
                                        >
                                            <MenuItem id={`MenuItem1-${index}`} onClick={() => {
                                                window.location.href = '/article/edit/'+post.slug;
                                                setAnchorEl(null);
                                                setOpenedMenuId(null);
                                            }}>
                                                <ListItemIcon>
                                                    <EditIcon/>
                                                </ListItemIcon>
                                                <ListItemText primary="Edit" />
                                            </MenuItem>
                                            <MenuItem id={`MenuItem2-${index}`} onClick={() => {
                                                setDeleteConfirmationIsShown(true);
                                                setPostToBeDeleted(post);
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
                                title={<NavLink to={`/article/${post.slug}`}>{post.title}</NavLink>}

                                subheader={post.created_at}
                            />
                            <CardMedia
                                className={classes.media}
                                image="https://images.pexels.com/photos/2127733/pexels-photo-2127733.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
                                title="Car"
                            />
                            <CardContent>
                                <Typography variant="body2" color="textSecondary" component="p">
                                    {post.excerpt}
                                </Typography>
                            </CardContent>
                            <CardActions disableSpacing>
                                <IconButton aria-label="add to favorites" onClick={(event) => {
                                    onPostLike(event, post.id);
                                }}>
                                    <Link
                                        className={classes.flex}
                                        color="inherit"
                                    ><FavoriteIcon /></Link>
                                    {post.likes !== 0 &&
                                        <Box className={classes.IconNumber} component="span" m={1}>
                                            {post.likes}
                                        </Box>
                                    }
                                </IconButton>
                                <IconButton aria-label="comments">
                                    <Link className={classes.flex} color="inherit" href={`/article/${post.slug}`}><CommentIcon /></Link>
                                    {post.comments !== 0 && <Box className={classes.IconNumber} component="span" m={1}>{post.comments}</Box>}
                                </IconButton>
                                <IconButton
                                    className={clsx(classes.expand, {
                                        [classes.expandOpen]: expandedId === post.id,
                                    })}
                                    onClick={() => {
                                        if(expandedId !== post.id){
                                            setExpandedId(post.id);
                                            setExpanded(true);
                                        } else {
                                            setExpandedId(null);
                                            setExpanded(false);
                                        }
                                    }}
                                    aria-expanded={expanded}
                                    aria-label="show more"
                                >
                                    <ExpandMoreIcon />
                                </IconButton>
                            </CardActions>
                            <Collapse in={expandedId === post.id} id={`"collapse"+${post.id}`} timeout="auto" unmountOnExit>
                                <CardContent>
                                    <Typography variant="body2" color="textPrimary" component="p">
                                        {post.content}
                                    </Typography>
                                </CardContent>
                            </Collapse>
                        </Card>

                        <MarginDivider/>
                    </Grid>

                    ))}

                {deleteConfirmationIsShown && (
                    <DeleteDialog post={postToBeDeleted}
                                  open={deleteConfirmationIsShown}
                                  setDeleteConfirmationIsShown={setDeleteConfirmationIsShown}
                    />
                )}
            </GridMargin>


    );
}