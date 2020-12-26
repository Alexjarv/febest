//REACT
import React from 'react';
//ROUTER
import BrowserRouter from 'react-router-dom/BrowserRouter';
import Route from 'react-router-dom/Route';
import Switch from 'react-router-dom/Switch';
//MUI COMPONENTS
import {makeStyles} from '@material-ui/core/styles';
//CUSTOM COMPONENTS
import Sidebar from "./components/Sidebar";
import BlogContextProvider from "./contexts/BlogContextProvider";
import Posts from "./components/Posts";
import {Container, CssBaseline, Grid} from "@material-ui/core";

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


const Router = () => {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path="/" component={PostsList}/>
                <Route exact path="/tag-list" component={null}/>
            </Switch>
        </BrowserRouter>
    );
};

export default Router;