import React, {Fragment, useContext, useState} from 'react';
import {CommentsContext} from '../contexts/CommentsContextProvider';
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
import AddIcon from '@material-ui/icons/Add';
import {red} from "@material-ui/core/colors";


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

    const context = useContext(CommentsContext);
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [addCommentContent, setAddCommentContent] = useState('');


    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const onCreateSubmit = (event) => {
        event.preventDefault();
        context.createComment(event, {content: addCommentContent});
        setAddCommentContent('');
    };

    const onEditSubmit = (postId, event) => {
        event.preventDefault();
    };

    return (
            <Grid className={classes.Box} item xs={12}>
                <h3>Comments </h3>
                <form onSubmit={onCreateSubmit}>
                    <TextField variant="outlined"
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
                    <IconButton color="primary" onClick={onCreateSubmit}>
                        <AddIcon/>
                    </IconButton>
                </form>

                {/*{context.comments.slice().reverse().map((comment, index) => (*/}
                {/*        <Card key={comment.id} className={classes.noBox}>*/}
                {/*            <CardHeader*/}
                {/*                className={classes.commentHeader}*/}
                {/*                avatar={*/}
                {/*                    <Avatar aria-label="recipe" className={classes.avatar}>*/}
                {/*                        A*/}
                {/*                    </Avatar>*/}
                {/*                }*/}
                {/*                action={*/}
                {/*                    <Box>*/}
                {/*                        <IconButton aria-controls="settings" aria-haspopup="true" onClick={handleClick}>*/}
                {/*                            <MoreVertIcon/>*/}
                {/*                        </IconButton>*/}
                {/*                        <Menu*/}
                {/*                            id="menu"*/}
                {/*                            anchorEl={anchorEl}*/}
                {/*                            keepMounted*/}
                {/*                            open={Boolean(anchorEl)}*/}
                {/*                            onClose={handleClose}*/}
                {/*                        >*/}
                {/*                            <MenuItem onClick={handleClose}>*/}
                {/*                                <ListItemIcon>*/}
                {/*                                    <VisibilityOffIcon/>*/}
                {/*                                </ListItemIcon>*/}
                {/*                                <ListItemText primary="Hide" />*/}
                {/*                            </MenuItem>*/}
                {/*                            <MenuItem onClick={() => {*/}
                {/*                                handleClose();*/}
                {/*                            }}>*/}
                {/*                                <ListItemIcon>*/}
                {/*                                    <DeleteIcon/>*/}
                {/*                                </ListItemIcon>*/}
                {/*                                <ListItemText primary="Delete" />*/}
                {/*                            </MenuItem>*/}
                {/*                        </Menu>*/}
                {/*                    </Box>*/}
                {/*                }*/}
                {/*                titleTypographyProps={{variant:'h6' }}*/}
                {/*                title={<NavLink to={`/user/1}`}>Anon</NavLink>}*/}
                
                {/*                subheader={comment.created_at}*/}
                {/*            />*/}
                {/*            <CardContent>*/}
                {/*                <Typography variant="body2" component="p">*/}
                {/*                    {comment.content}*/}
                {/*                </Typography>*/}
                {/*            </CardContent>*/}
                {/*            <CardActions disableSpacing>*/}
                {/*                <IconButton aria-label="add to favorites">*/}
                {/*                    {comment.likes !== 0 && <Box className={classes.IconNumber} component="div" m={1}>{comment.likes}</Box>}*/}
                {/*                    <Link className={classes.flex} color="inherit"><FavoriteIcon /></Link>*/}
                {/*                </IconButton>*/}
                {/*            </CardActions>*/}
                {/*        </Card>*/}
                
                {/*    ))}*/}

            </Grid>
    );
}