/*
 * Welcome to your app's main JavaScript file!
 *
 * We recommend including the built version of this JavaScript file
 * (and its CSS file) in your base layout (base.html.twig).
 */
import Posts from "./components/Posts";

console.log('App.js is connected;');

// any CSS you import will output into a single css file (app.css in this case)
import './styles/app.css';
console.log('App.css is connected;');
// start the Stimulus application
import './bootstrap';

//REACT
import React from 'react';
import ReactDOM from 'react-dom';
import BlogContextProvider from "./contexts/BlogContextProvider";
import {Container, CssBaseline, Grid, makeStyles, withStyles} from "@material-ui/core";
import Sidebar from "./components/Sidebar";


class App extends React.Component {

    render() {
        return (
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
    }
}

ReactDOM.render(
    <App/>
    , document.getElementById('root'));