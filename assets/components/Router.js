//REACT
import React from 'react';
//ROUTER
import BrowserRouter from 'react-router-dom/BrowserRouter';
import Route from 'react-router-dom/Route';
import Switch from 'react-router-dom/Switch';
import { useParams } from "react-router";
//MUI COMPONENTS
import {makeStyles} from '@material-ui/core/styles';
//CUSTOM COMPONENTS
import Sidebar from "./Sidebar";
import BlogContextProvider from "../contexts/BlogContextProvider";
import Posts from "./Posts";
import {Breadcrumbs, Container, CssBaseline, Grid, Link} from "@material-ui/core";
import Post from "./Post";
import NewPost from "./NewPost";
import SignIn from "./SignIn";
import SignUp from "./SignUp";

const PostsListRoute = () => (
    <React.Fragment>
        <CssBaseline />
        <BlogContextProvider>
            <Posts/>
            <Sidebar/>
        </BlogContextProvider>
    </React.Fragment>
);

const NewPostRoute = () => (
    <React.Fragment>
        <CssBaseline />
        <BlogContextProvider>
            <NewPost/>
            <Sidebar/>
        </BlogContextProvider>
    </React.Fragment>
);
const SignInRoute = () => (
    <React.Fragment>
        <CssBaseline />
        <BlogContextProvider>
            <SignIn/>
        </BlogContextProvider>
    </React.Fragment>
);
const SignUpRoute = () => (
    <React.Fragment>
        <CssBaseline />
        <BlogContextProvider>
            <SignUp/>
        </BlogContextProvider>
    </React.Fragment>
);


export default function Router() {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path="/" component={PostsListRoute}/>
                <Route exact path="/login" component={SignInRoute}/>
                <Route exact path="/register" component={SignUpRoute}/>
                <Route exact path="/" component={PostsListRoute}/>
                <Route exact path="/article/new" component={NewPostRoute}/>
                <Route exact path="/article/:slug" children={<PostInnerRoute/>} />
            </Switch>
        </BrowserRouter>
    );
};

function PostInnerRoute() {
    // We can use the `useParams` hook here to access
    // the dynamic pieces of the URL.
    let { slug } = useParams();

    return (
            <React.Fragment>
                <CssBaseline />
                <BlogContextProvider slug={slug}>
                    <Post/>
                    <Sidebar/>
                </BlogContextProvider>
            </React.Fragment>
    );
}
