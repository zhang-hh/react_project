import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import {connect} from "react-redux";
import {createDeleteUserInfoAction} from '../../redux/actions/login'

// export default connect(
// 	(state) => ({userInfo:state.userInfo}),//映射状态
// 	{deleteUserInfo:createDeleteUserInfoAction}//映射操作状态的方法
// )(Admin)

@connect(
	(state) => ({userInfo:state.userInfo}),
	{deleteUserInfo:createDeleteUserInfoAction}
)
class Admin extends Component {
	logout = () =>{
		//    清除redux的东西
		//	清空localStorage
		this.props.deleteUserInfo();
	};
	render() {
		const {isLogin} = this.props.userInfo;
		//如果没有登录,就跳到/login
		if (!isLogin) return <Redirect to="/login"/>;
		return (
			<div>
				欢迎登录,{this.props.userInfo.user.username}
				<button onClick={this.logout}>退出登录</button>
			</div>
		);

	}
}
export default Admin;
/*翻译为:
* Admin = connect(
* (state) => ({userInfo:state.userInfo}),
	{deleteUserInfo:createDeleteUserInfoAction}
)(Admin)*/