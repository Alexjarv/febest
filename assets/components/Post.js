import React, {Fragment, useContext} from 'react';
import {BlogContext} from '../contexts/BlogContextProvider';
import {
    Avatar,
    Box, Card, CardActions, CardContent, CardHeader, CardMedia, Collapse, Divider, Grid,
    IconButton, Link,
    makeStyles,
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

    const onCreateSubmit = (event) => {
        event.preventDefault();
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
                                <IconButton aria-label="settings">
                                    <MoreVertIcon />
                                </IconButton>
                            }
                            titleTypographyProps={{variant:'h6' }}
                            title={<NavLink to={`/article/${context.post.slug}`}>{context.post.title}</NavLink>}

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
                            <IconButton aria-label="comment">
                                {context.post.comments !== 0 && <Box className={classes.IconNumber} component="div" m={1}>{context.post.comments}</Box>}
                                <Link className={classes.flex} color="inherit" href={`/article/${context.post.slug}`}><CommentIcon /></Link>
                            </IconButton>
                            <IconButton className={classes.right}>
                                <ExpandMoreIcon/>
                            </IconButton>
                        </CardActions>
                    </Card>
                    <MarginDivider/>
                </Grid>
        </GridMargin>
    );
}