import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import grey from '@material-ui/core/colors/grey';
import * as serviceWorker from './serviceWorker';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: grey[900]
    },
    secondary: {
      main: grey[900]
    },
    type: 'dark'
  },
  typography: {
    useNextVariants: true,
  },
});

ReactDOM.render(
<MuiThemeProvider theme={theme}>
  <App />
</MuiThemeProvider>,
document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
