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
    const [deleteConfirmationIsShown, setDeleteConfirmationIsShown] = useState(false);

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

    return (
            <Grid className={classes.Box} item xs={12}>
                <h3>Comments</h3>
                <Card className={classes.noBox}>
                    <CardHeader
                        className={classes.commentHeader}
                        avatar={
                            <Avatar aria-label="recipe" className={classes.avatar}>
                                A
                            </Avatar>
                        }
                        action={
                            <Box>
                                <IconButton aria-controls="settings" aria-haspopup="true" onClick={handleClick}>
                                    <MoreVertIcon/>
                                </IconButton>
                                <Menu
                                    id="menu"
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
                        title={<NavLink to={`/user/1}`}>Anon</NavLink>}

                        subheader={context.post.created_at}
                    />
                    <CardContent>
                        <Typography variant="body2" component="p">
                            {context.post.content}
                        </Typography>
                    </CardContent>
                    <CardActions disableSpacing>
                        <IconButton aria-label="add to favorites">
                            {context.post.likes !== 0 && <Box className={classes.IconNumber} component="div" m={1}>{context.post.likes}</Box>}
                            <Link className={classes.flex} color="inherit"><FavoriteIcon /></Link>
                        </IconButton>
                    </CardActions>
                </Card>
                {deleteConfirmationIsShown && (
                    <DeleteDialog post={postToBeDeleted}
                                  open={deleteConfirmationIsShown}
                                  setDeleteConfirmationIsShown={setDeleteConfirmationIsShown}
                    />
                )}
            </Grid>
    );
}