import React, {Fragment, useContext, useState} from 'react';
import {BlogContext} from '../contexts/BlogContextProvider';
import {
    Avatar,
    Box, Card, CardActions, CardContent, CardHeader, CardMedia, Chip, Collapse, Divider, Fade, Grid,
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


const useStyles = makeStyles((theme) => ({
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
    top: {
        marginTop: '10px'
    },
    chip: {
        margin: '5px'
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

export default function Post() {

    const context = useContext(BlogContext);
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [postToBeDeleted, setPostToBeDeleted] = useState(null);
    const [OpenedMenuId, setOpenedMenuId] = React.useState(null);
    const [deleteConfirmationIsShown, setDeleteConfirmationIsShown] = useState(false);

    const handleClose = () => {
        setAnchorEl(null);
        setOpenedMenuId(null);
    };

    const onEditSubmit = (postId, event) => {
        event.preventDefault();
    };

    return (
        <GridMargin container item xs={12} md={8} spacing={3} >
                <Grid item xs={12}>
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
                                                if(OpenedMenuId !== context.post.id){
                                                    setOpenedMenuId(context.post.id);
                                                } else {
                                                    setOpenedMenuId(null);
                                                }
                                                setAnchorEl(event.currentTarget);
                                            }}>
                                                <MoreVertIcon/>
                                            </IconButton>
                                            <Menu
                                                id={`menu-01`}
                                                anchorEl={anchorEl}
                                                keepMounted
                                                open={OpenedMenuId === context.post.id}
                                                onClose={handleClose}
                                                TransitionComponent={Fade}
                                            >
                                                <MenuItem id={`MenuItem1-01`} onClick={() => {
                                                    window.location.href = '/article/edit/' + context.post.slug;
                                                    setAnchorEl(null);
                                                    setOpenedMenuId(null);
                                                }}
                                                >
                                                    <ListItemIcon>
                                                        <EditIcon/>
                                                    </ListItemIcon>
                                                    <ListItemText primary="Edit" />
                                                </MenuItem>
                                                <MenuItem id={`MenuItem2-01`} onClick={() => {
                                                    setDeleteConfirmationIsShown(true);
                                                    setPostToBeDeleted(context.post);
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
                            titleTypographyProps={{variant:'h5' }}
                            title={<NavLink to={`/article/${context.post.slug}`}>{context.post.title}</NavLink>}
                            subheader={context.post.created_at}
                        />
                        <CardMedia
                            className={classes.media}
                            image="https://images.pexels.com/photos/2127733/pexels-photo-2127733.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
                            title="Car"
                        />
                        <CardContent>
                            <Typography variant="body2" component="p">
                                {context.post.content}
                            </Typography>
                            <Typography className={classes.top} variant="body2" component="p">
                                {context.postCategories.slice().reverse().map((category, index) => (
                                    <Chip className={classes.chip} label={`${category}`} />
                                ))}
                            </Typography>
                        </CardContent>
                        <CardActions disableSpacing>
                            <IconButton aria-label="add to favorites">
                                <Link className={classes.flex} color="inherit"><FavoriteIcon /></Link>
                                {context.post.likes !== 0 && <Box className={classes.IconNumber} component="div" m={1}>{context.post.likes}</Box>}
                            </IconButton>
                            <IconButton aria-label="comment">
                                <Link className={classes.flex} color="inherit" href={`/article/${context.post.slug}`}><CommentIcon /></Link>
                                {context.post.comments !== 0 && <Box className={classes.IconNumber} component="div" m={1}>{context.post.comments}</Box>}
                            </IconButton>
                        </CardActions>
                    </Card>
                    <MarginDivider/>
                </Grid>

                <Comments/>

            {deleteConfirmationIsShown && (
                <DeleteDialog post={postToBeDeleted}
                              open={deleteConfirmationIsShown}
                              setDeleteConfirmationIsShown={setDeleteConfirmationIsShown}
                              isInside={true}
                />
            )}
        </GridMargin>
    );
}