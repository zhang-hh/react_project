import React, {Component} from 'react';
import {connect} from "react-redux";
import {Switch,Redirect,Route} from 'react-router-dom'
import {createDeleteUserInfoAction} from '../../redux/actions/login'
import check from "../check/check";
import './css/admin.less'
import Header from "../header/header";
import {Layout} from 'antd';
import LeftNav from "../left-nav/left-nav";
import Home from '../../components/home/home'
import Category from '../category/category'
import Product from '../product/product'
import Role from '../role/role'
import User from '../user/user'
import Bar from '../../components/bar/bar'
import Line from '../../components/line/line'
import Pie from '../../components/pie/pie'
const {Footer, Sider, Content } = Layout;

// export default connect(
// 	(state) => ({userInfo:state.userInfo}),//映射状态
// 	{deleteUserInfo:createDeleteUserInfoAction}//映射操作状态的方法
// )(Admin)

@connect(
	(state) => ({userInfo:state.userInfo}),
	{deleteUserInfo:createDeleteUserInfoAction}
)
@check
class Admin extends Component {
	logout = () =>{
		//    清除redux的东西
		//	清空localStorage
		this.props.deleteUserInfo();
	};
	render() {
		return (
			<Layout className="layout">
				<Sider>
					<LeftNav/>
				</Sider>
				<Layout>
					<Header/>
					<Content className="content">
						<Switch>
						<Route path='/admin/home' component={Home}/>
						<Route path='/admin/prod_about/category' component={Category}/>
							<Route path='/admin/prod_about/product' component={Product}/>
							<Route path='/admin/role' component={Role}/>
							<Route path='/admin/user' component={User}/>
							<Route path='/admin/charts/bar' component={Bar}/>
							<Route path='/admin/charts/line' component={Line}/>
							<Route path='/admin/charts/pie' component={Pie}/>
							<Redirect to='/admin/home' />
						</Switch>
					</Content>
					<Footer className='footer'>推荐使用谷歌浏览器,获取最佳用户体验</Footer>
				</Layout>
			</Layout>
		);

	}
}
export default Admin;
/*翻译为:
* Admin = connect(
* (state) => ({userInfo:state.userInfo}),
	{deleteUserInfo:createDeleteUserInfoAction}
)(Admin)*/