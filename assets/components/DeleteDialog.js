import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import PropTypes from 'prop-types';
import React, {useContext} from 'react';
import {BlogContext} from '../contexts/BlogContextProvider';

function DeleteDialog(props) {
    const context = useContext(BlogContext);

    const hide = () => {
        props.setDeleteConfirmationIsShown(false);
    };

    return (
        <Dialog onClose={hide} fullWidth={true} maxWidth='sm' open={props.open}>
            <DialogTitle>Are you sure you wish to delete this post?</DialogTitle>
            <DialogContent>
                {props.post.title}
            </DialogContent>
            <DialogActions>
                <Button onClick={hide}>Cancel</Button>
                <Button onClick={() => {
                    context.deletePost(props.post);
                    hide();
                }}>
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    );
}

DeleteDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    setDeleteConfirmationIsShown: PropTypes.func.isRequired,
    post: PropTypes.shape({
        id: PropTypes.number.isRequired,
    })
};

export default DeleteDialog;