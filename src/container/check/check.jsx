/*check组件是一个高阶组件
*   1.接收一个组件
*   2.返回一个新组件*/
/*check组件能够对传入的组件,进行权限检查
*   例如:未登录,不能看admin,登录了,不能看到log*/
import {connect} from 'react-redux';
import React,{Component} from "react";
import {Redirect} from 'react-router-dom';
export default function (ReceiveCommpont) {
	@connect(
		(state) =>({isLogin:state.userInfo.isLogin}),
		{}
	)
	class NewComponent extends Component{
		render() {
			//console.log(this.props.a)
			const {isLogin} = this.props;
			const {pathname} = this.props.location;
			if (isLogin && pathname==='/login') return <Redirect to='/admin'/>;
			//如果没有登录只能访问login界面 那么就不是login
			if (!isLogin && pathname!=='/login') return <Redirect to='/login'/>;
			return(
				<ReceiveCommpont {...this.props}/>
			)
		}
	}
	return NewComponent;
}

