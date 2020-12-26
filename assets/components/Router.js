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
import {Container, CssBaseline, Grid} from "@material-ui/core";
import Post from "./Post";

const PostsList = () => (
    <React.Fragment>
        <CssBaseline />
        <BlogContextProvider>
            <Container maxWidth="lg">
                <h1>Febest Blog</h1>
                <Grid container spacing={5}>
                    <Posts/>
                    <Sidebar/>
                </Grid>
            </Container>
        </BlogContextProvider>
    </React.Fragment>
);


export default function Router() {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path="/" component={PostsList}/>
                <Route exact path="/article/:slug" children={<PostInner/>} />
            </Switch>
        </BrowserRouter>
    );
};

function PostInner() {
    // We can use the `useParams` hook here to access
    // the dynamic pieces of the URL.
    let { slug } = useParams();

    return (
            <React.Fragment>
                <CssBaseline />
                <BlogContextProvider slug={slug}>
                    <Container maxWidth="lg">
                        <h1>Febest Blog</h1>
                        <Grid container spacing={5}>
                            <Post/>
                            <Sidebar/>
                        </Grid>
                    </Container>
                </BlogContextProvider>
            </React.Fragment>
    );
}
