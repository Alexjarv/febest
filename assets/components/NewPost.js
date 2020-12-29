import React, {Fragment, useContext, useState} from 'react';
import {BlogContext} from '../contexts/BlogContextProvider';
import {
    Avatar,
    Box,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    CardMedia,
    Collapse,
    Divider,
    FormControl, FormControlLabel,
    FormGroup, FormHelperText,
    FormLabel,
    Grid,
    IconButton,
    Link,
    ListItemIcon,
    ListItemText,
    makeStyles,
    Menu,
    MenuItem,
    Paper, Switch,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Typography,
    withStyles
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
import SendIcon from '@material-ui/icons/Send';
import Button from "@material-ui/core/Button";


const useStyles = makeStyles((theme) => ({
    heading: {
        marginBottom: "15px",
    },
    inline:{
        display: "inline-block",
        width: "fit-content"
    },
    padding:{
        padding: "20px"
    },
    formPadding:{
        marginTop: "10px",
        marginBottom: "10px"
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
    const [addAddCategory, setAddCategory] = React.useState(null);
    const classes = useStyles();

    const onCreateSubmit = (event) => {
        event.preventDefault();
        context.createPost(event, {title: addPostTitle, content: addPostContent});
        setAddPostTitle('');
        setAddPostContent('');
    };

    const handleChange = id => event => {
        setAddCategory({ ...addAddCategory, [id]: event.target.checked });
        console.log(addAddCategory);
    };

    return (
        <GridMargin container item xs={12} md={8} spacing={3} >
            <Grid item xs={12}>
                <h3 className={classes.heading}>Add New Post</h3>
                <Paper className={classes.padding}>
                    <form onSubmit={onCreateSubmit}>
                        <FormGroup>
                            <TextField className={classes.formPadding} variant="outlined"
                                       size="small"
                                       type="text"
                                       value={addPostTitle}
                                       onChange={(event) => {
                                           setAddPostTitle(event.target.value);
                                       }}
                                       label="Title"
                                       fullWidth={true}
                                       multiline={true}/>
                            <TextField className={classes.formPadding} variant="outlined"
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
                            <FormControl className={classes.formPadding} component="fieldset">
                                <FormLabel component="legend">Categories</FormLabel>
                                <FormGroup className={classes.inline}>
                                    {context.categories.slice().reverse().map((category) => (
                                        <FormControlLabel key={"category" + category.id} onChange={handleChange(category.id)} value={`${category.id}`} control={<Switch />} label={`${category.title}`} />
                                    ))}
                                </FormGroup>
                            </FormControl>
                            <Button
                                variant="contained"
                                color="primary"
                                className={classes.button}
                                startIcon={<SendIcon/>}
                                onClick={onCreateSubmit}
                            >
                                Upload
                            </Button>
                        </FormGroup>
                    </form>
                </Paper>
            </Grid>
        </GridMargin>
    );
}