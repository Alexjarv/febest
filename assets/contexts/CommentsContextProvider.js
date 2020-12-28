import React, {createContext} from 'react';
import axios from 'axios';
import {Breadcrumbs, Container, Grid, Link} from "@material-ui/core";

export const CommentsContext = createContext();

class CommentsContextProvider extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            comments: [],
            message: {}
        };
        this.readComments();
    }

    //create
    createComment(event, comment) {
        event.preventDefault();
        axios.post('/api/comments/create', comment)
            .then(response => {
                if (response.data.message.level === 'success') {
                    let data = [...this.state.comment];
                    data.push(response.data.comment);
                    this.setState({
                        comments: data,
                        message: response.data.message,
                    });
                } else {
                    this.setState({
                        message: response.data.message,
                    });
                }
            }).catch(error => {
            console.error(error);
        });

    }

    //read
    readComments() {
        axios.get('/api/comments/read')
            .then(response => {
                this.setState({
                    comments: response.data,
                });
            }).catch(error => {
            console.error(error);
        });
    }

    //update
    updateComment(data) {
        axios.put('/api/comments/update/' + data.id, data)
            .then(response => {
                if (response.data.message.level === 'error') {
                    this.setState({
                        message: response.data.message,
                    });
                } else {
                    let comments = [...this.state.comments];
                    let comment = comments.find(comment => {
                        return comment.id === data.id;
                    });

                    comment.content = response.data.comment.content;

                    this.setState({
                        comments: comments,
                        message: response.data.message,
                    });
                }
            }).catch(error => {
            console.error(error);
        });
    }

    //delete
    deleteComment(data) {
        axios.delete('/api/comments/delete/' + data.id)
            .then(response => {
                console.log(response);
                if (response.data.message.level === 'error') {
                    this.setState({
                        message: response.data.message,
                    });
                } else {
                    //message
                    let comments = [...this.state.comments];
                    let comment = comments.find(comment => {
                        return comment.id === data.id;
                    });

                    comments.splice(comments.indexOf(comment), 1);

                    this.setState({
                        comments: comments,
                        message: response.data.message
                    });
                }
            }).catch(error => {
            console.error(error);
        });
    }

    render() {
        return (
            <CommentsContext.Provider value={{
                ...this.state,
                createComment: this.createComment.bind(this),
                updateComment: this.updateComment.bind(this),
                deleteComment: this.deleteComment.bind(this),
                setMessage: (message) => this.setState({message: message}),
            }}>
                {this.props.children}
            </CommentsContext.Provider>
        );
    }
}

export default CommentsContextProvider;