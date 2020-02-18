import React, {Component} from "react";
import {Route, Switch, Redirect} from "react-router-dom";
import Login from "./container/login/login";
import Admin from "./container/admin/admin";

export default class App extends Component {
	render() {
		return (
			<Switch>
				<Route path="/login" component={Login}/>
				<Route path="/admin" component={Admin}/>
				<Redirect to="/login"/>
			</Switch>
		);
	}
}

/*function demo(target) {
	target.a = 1
	target.b = 2
}

@demo
class Myclass {}

class Myclass {}
demo(Myclass)

function demo(target){
	target.a = 1
	target.b = 2
	return 100
}
@demo
class Myclass {}
class Myclass {}
Myclass = demo(Myclass)
console.log(Myclass)

function test() {
	function demo(target){
		target.a = 1
		target.b = 2
		return target //这样就是直接返回这个类,不会赋值
	}
  return demo
}

@test()
class Myclass{}
//class Myclass{}
//test()(Myclass)
console.log(Myclass);*/

