import React, {createContext} from 'react';
import axios from 'axios';

export const BlogContext = createContext();

class BlogContextProvider extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            posts: [],
            categories: [],
            message: {},
            post: {}
        };
        if(props.slug){
            this.readPost(props.slug);
        } else {
            this.readPosts();
        }
        this.readCategories();
    }

    //create
    createPost(event, post) {
        event.preventDefault();
        axios.post('/api/post/create', post)
            .then(response => {
                if (response.data.message.level === 'success') {
                    let data = [...this.state.posts];
                    data.push(response.data.post);
                    this.setState({
                        posts: data,
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
    readPost(slug) {
        console.log(slug);
        axios.get('/api/posts/readOne/'+ slug)
            .then(response => {
                this.setState({
                    post: response.data,
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
    updatePost(data) {
        axios.put('/api/post/update/' + data.id, data)
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
    deletePost(data) {
        axios.delete('/api/post/delete/' + data.id)
            .then(response => {
                if (response.data.message.level === 'error') {
                    this.setState({
                        message: response.data.message,
                    });
                } else {
                    //message
                    let posts = [...this.state.posts];
                    let post = posts.find(post => {
                        return post.id === data.id;
                    });

                    posts.splice(posts.indexOf(post), 1);

                    this.setState({
                        posts: posts,
                        message: response.data.message
                    });
                }
            }).catch(error => {
            console.error(error);
        });
    }

    render() {
        return (
            <BlogContext.Provider value={{
                ...this.state,
                createPost: this.createPost.bind(this),
                updatePost: this.updatePost.bind(this),
                deletePost: this.deletePost.bind(this),
                setMessage: (message) => this.setState({message: message}),
            }}>
                {this.props.children}
            </BlogContext.Provider>
        );
    }
}

export default BlogContextProvider;