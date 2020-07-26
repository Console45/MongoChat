import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import MongoChat from './container/MongoChat';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
	<React.StrictMode>
		<MongoChat />
	</React.StrictMode>,
	document.getElementById('root')
);

serviceWorker.register();
