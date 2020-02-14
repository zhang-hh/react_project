import React from "react";
import ReactDOM from 'react-dom';
import {Provider} from "react-redux";
import {BrowserRouter} from 'react-router-dom'
import App from "./App";
import store from "./redux/store";
//redux 里的状态更改了,provider就会页面自动刷新
ReactDOM.render(<Provider store={store}><BrowserRouter><App/></BrowserRouter></Provider>,document.getElementById("root"));