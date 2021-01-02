import React, {createContext} from 'react';
import axios from 'axios';
import {Breadcrumbs, Container, Grid, Link} from "@material-ui/core";
import {Redirect} from "react-router";
import Navigation from "../components/Navigation";
import AppSnackbar from "../components/AppSnackbar";

export const BlogContext = createContext();

class BlogContextProvider extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            posts: [],
            categories: [],
            message: {},
            post: {},
            user: {},
            postIsLiked: {value: false},
            isAuthenticated: {},
            lastUsername: {},
            error: {},
            postCategories: [],
            comments: [],
        };
        if(props.slug){
            this.readPost(props.slug);
        } else if(props.categorySlug){
            this.readCategoryPosts(props.categorySlug);
        } else {
            this.readPosts();
        }
        this.readCategories();
    }

    componentDidMount() {
        this.readUser();
    }

    readUser(){
        const isAuthenticated = document.querySelector(".js-user").getAttribute('data-is-authenticated');
        const user = document.querySelector(".js-user-profile").getAttribute('data-user-profile');
        const lastUsername = document.querySelector(".js-lastUsername").getAttribute('data-is-lastusername');

        if(user){
            this.setState({
                user: JSON.parse(user),
            });
        }
        if(isAuthenticated){
            this.setState({
                isAuthenticated: isAuthenticated,
            });
        }
    }

    //create
    createPost(event, post) {
        event.preventDefault();
        axios.post('/api/posts/create', post)
            .then(response => {
                if (response.data.message.level === 'success') {
                    this.setState({
                        message: response.data.message,
                    });

                    setTimeout(function(){ window.location.href = "/"; }, 1500);

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
    readPosts() {
        axios.get('/api/posts/read')
            .then(response => {
                this.setState({
                    posts: response.data,
                });
            }).catch(error => {
            console.error(error);
        });
    }

    //read
    searchPosts(data) {
        axios.get('/api/posts/search/' + data.content)
            .then(response => {
                this.setState({
                    posts: response.data,
                });
            }).catch(error => {
            console.error(error);
        });
    }

    //read
    readPost(slug) {
        axios.get('/api/posts/readOne/'+ slug)
            .then(response => {
                this.setState({
                    post: response.data,
                });
                this.readPostCategories(response.data.id);
                this.readComments(response.data.id);
            }).catch(error => {
            console.error(error);
        });
    }

    //read
    readCategoryPosts(slug) {
        axios.get('/api/posts/readCategory/'+ slug)
            .then(response => {
                this.setState({
                    posts: response.data,
                });
            }).catch(error => {
            console.error(error);
        });
    }

    //read
    readPostCategories(id) {
        axios.get('/api/categories/readByPost/' + id)
            .then(response => {
                this.setState({
                    postCategories: response.data,
                });
            }).catch(error => {
            console.error(error);
        });
    }

    //read
    readCategories() {
        axios.get('/api/categories/read')
            .then(response => {
                this.setState({
                    categories: response.data,
                });
            }).catch(error => {
            console.error(error);
        });
    }

    //update
    likePost(data) {
        axios.put('/api/posts/like/' + data.id)
            .then(response => {
                if (response.data.message.level === 'error') {
                    this.setState({
                        message: response.data.message,
                    });
                } else {
                    let posts = [...this.state.posts];
                    let post = posts.find(post => {
                        return post.id === data.id;
                    });

                    post.likes = response.data.post.likes;

                    this.setState({
                        posts: posts,
                        message: response.data.message,
                    });
                }
            }).catch(error => {
            console.error(error);
        });
    }

    //update
    updatePost(data) {
        axios.put('/api/posts/update/' + data.id, data)
            .then(response => {
                if (response.data.message.level === 'error') {
                    this.setState({
                        message: response.data.message,
                    });
                } else {
                    let posts = [...this.state.posts];
                    let post = posts.find(post => {
                        return post.id === data.id;
                    });

                    post.title = response.data.post.title;
                    post.content = response.data.post.content;

                    this.setState({
                        posts: posts,
                        message: response.data.message,
                    });
                }
            }).catch(error => {
            console.error(error);
        });
    }

    //delete
    deletePost(data, isInside) {
        axios.delete('/api/posts/delete/' + data.id)
            .then(response => {
                if (response.data.message.level === 'error') {
                    this.setState({
                        message: response.data.message,
                    });
                } else {
                    //message
                    if(!isInside) {
                        let posts = [...this.state.posts];
                        let post = posts.find(post => {
                            return post.id === data.id;
                        });

                        posts.splice(posts.indexOf(post), 1);

                        this.setState({
                            posts: posts,
                            message: response.data.message
                        });
                    } else {
                        window.location.href = "/";
                    }
                }
            }).catch(error => {
            console.error(error);
        });
    }

    //create
    createComment(event, comment) {
        event.preventDefault();
        axios.post('/api/comments/create', comment)
            .then(response => {
                if (response.data.message.level === 'success') {
                    let data = [...this.state.comments];
                    data.push(response.data.comment);
                    this.setState({
                        comments: data,
                        post: response.data.post,
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
    readComments(id) {
        axios.get('/api/comments/read/' + id)
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

    //hide
    hideComment(data) {
        axios.put('/api/comments/hide/' + data.comment_id)
            .then(response => {
                if (response.data.message.level === 'error') {
                    this.setState({
                        message: response.data.message,
                    });
                } else {
                    this.setState({
                        comments: response.data.comments,
                        message: response.data.message
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
                        post: response.data.post,
                        message: response.data.message
                    });
                }
            }).catch(error => {
            console.error(error);
        });
    }

    //read
    logout() {
        return <Redirect to='/logout'/>
    }

    render() {
        return (
            <BlogContext.Provider value={{
                ...this.state,
                createPost: this.createPost.bind(this),
                readPosts: this.readPosts.bind(this),
                searchPosts: this.searchPosts.bind(this),
                updatePost: this.updatePost.bind(this),
                deletePost: this.deletePost.bind(this),
                likePost: this.likePost.bind(this),
                createComment: this.createComment.bind(this),
                updateComment: this.updateComment.bind(this),
                hideComment: this.hideComment.bind(this),
                deleteComment: this.deleteComment.bind(this),
                logout: this.logout.bind(this),
                setMessage: (message) => this.setState({message: message}),
            }}>
                <Navigation/>
                <AppSnackbar/>
                    <Container m={5} maxWidth="lg">
                        <Breadcrumbs aria-label="navigation">
                            <Link color="inherit" href="/">
                                Blogs
                            </Link>
                            {this.props.slug &&
                                <Link
                                    color="textPrimary"
                                    href={`/article/${this.props.slug}`}
                                    aria-current="page"
                                >
                                    {this.state.post.title}
                                </Link>
                            }

                        </Breadcrumbs>
                        <h1>Febest Blog</h1>
                        <Grid container spacing={5}>
                            {this.props.children}
                        </Grid>
                    </Container>
            </BlogContext.Provider>
        );
    }
}

export default BlogContextProvider;