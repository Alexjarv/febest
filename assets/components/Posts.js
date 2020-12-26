import React, {Fragment, useContext, useState} from 'react';
import {BlogContext} from '../contexts/BlogContextProvider';
import {
    Avatar,
    Box, Button, Card, CardActions, CardContent, CardHeader, CardMedia, Collapse, Divider, Grid,
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
    const [deleteConfirmationIsShown, setDeleteConfirmationIsShown] = useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [postToBeDeleted, setPostToBeDeleted] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const onCreateSubmit = (event) => {
        event.preventDefault();
    };

    const onEditSubmit = (postId, event) => {
        event.preventDefault();
    };

    const [expanded, setExpanded] = React.useState(false);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    return (
            <GridMargin container item xs={12} md={8} spacing={3} >
                {context.posts.slice().reverse().map((post, index) => (
                    <Grid item xs={12} key={'post' + index}>
                        <Card className={classes.root}>
                            <CardHeader
                                avatar={
                                    <Avatar aria-label="recipe" className={classes.avatar}>
                                        F
                                    </Avatar>
                                }
                                action={
                                    <Box>
                                        <IconButton aria-controls="settings" aria-haspopup="true" onClick={handleClick}>
                                            <MoreVertIcon/>
                                        </IconButton>
                                        <Menu
                                        id={`${index} + "menu" `}
                                        anchorEl={anchorEl}
                                        keepMounted
                                        open={Boolean(anchorEl)}
                                        onClose={handleClose}
                                        >
                                            <MenuItem onClick={handleClose}>
                                                <ListItemIcon>
                                                    <EditIcon/>
                                                </ListItemIcon>
                                                <ListItemText primary="Edit" />
                                            </MenuItem>
                                            <MenuItem onClick={() => {
                                                setDeleteConfirmationIsShown(true);
                                                setPostToBeDeleted(post);
                                                handleClose();
                                            }}>
                                                <ListItemIcon>
                                                    <DeleteIcon/>
                                                </ListItemIcon>
                                                <ListItemText primary="Delete" />
                                            </MenuItem>
                                        </Menu>
                                    </Box>
                                }
                                titleTypographyProps={{variant:'h6' }}
                                title={<NavLink to={`/article/${post.slug}`}>{post.title}</NavLink>}

                                subheader={post.created_at}
                            />
                            <CardMedia
                                className={classes.media}
                                image="https://a.d-cd.net/iaAAAgDlb-A-480.jpg"
                                title="Car bus"
                            />
                            <CardContent>
                                <Typography variant="body2" color="textSecondary" component="p">
                                    {post.excerpt}
                                </Typography>
                            </CardContent>
                            <CardActions disableSpacing>
                                <IconButton aria-label="add to favorites">
                                    {post.likes !== 0 && <Box className={classes.IconNumber} component="span" m={1}>{post.likes}</Box>}
                                    <Link className={classes.flex} color="inherit"><FavoriteIcon /></Link>
                                </IconButton>
                                <IconButton aria-label="comments">
                                    {post.comments !== 0 && <Box className={classes.IconNumber} component="span" m={1}>{post.comments}</Box>}
                                    <Link className={classes.flex} color="inherit" href={`/article/${post.slug}`}><CommentIcon /></Link>
                                </IconButton>
                                <IconButton
                                    className={clsx(classes.expand, {
                                        [classes.expandOpen]: expanded,
                                    })}
                                    onClick={handleExpandClick}
                                    aria-expanded={expanded}
                                    aria-label="show more"
                                >
                                    <ExpandMoreIcon />
                                </IconButton>
                            </CardActions>
                            <Collapse in={expanded} timeout="auto" unmountOnExit>
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