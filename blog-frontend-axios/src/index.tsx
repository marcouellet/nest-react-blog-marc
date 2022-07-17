import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
//import { Auth0Provider } from './contexts/auth0-context';
//import { PassportProvider } from './contexts/passport-context';
//import { BrowserRouter } from 'react-router-dom';

serviceWorker.unregister();

ReactDOM.render(<App />, document.getElementById('root'));

// ReactDOM.render(
// 	<PassportProvider>
// 		<BrowserRouter>
// 			<App />
// 		</BrowserRouter>
// 	</PassportProvider>,
// 	document.getElementById('root')
// );

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA

