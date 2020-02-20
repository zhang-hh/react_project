import React, {Component} from 'react';
import {Link,withRouter} from "react-router-dom";
import logo from '../../static/img/logo.png';
import menuList from '../../config/menu-config';
import { Menu, Icon } from 'antd';
import {connect} from 'react-redux';
import {createSaveTitleAction} from '../../redux/actions/header'
import './left-nav.less';
const { SubMenu,Item } = Menu;
@connect(
	(state) => ({title:state.headerTitle}),
	{saveTitle:createSaveTitleAction}
)
@withRouter //非路由组件想用路由组建的属性要用withRouter包装
class LeftNav extends Component {
	getTitle = () =>{
		console.log('redux里面没有title了');
		let title = '';
		let {pathname} = this.props.location;
		//登录成功的时候会出现/admin
		if (pathname ==='/admin') pathname ='/admin/home';
		if (pathname.indexOf('/product')) pathname='/admin/product';
		let currentKey = pathname.split('/').reverse()[0];
		menuList.forEach((menuObj) =>{
		    if (menuObj.children instanceof Array){
			    let result = menuObj.children.find((item) =>{
				    return item.key === currentKey; //刚才你写的是:return item.title === currentKey; 是错的
			    });
			    if(result) title = result.title;
		    }else {
			    //	没有孩子的
			    if (menuObj.key === currentKey) title=menuObj.title;
		    }
		});
		//将查找出来的title,保存到redux里面
		this.props.saveTitle(title)
	};
	componentDidMount() {
		//console.log('left-Nav');//只会出现一次,也就是this.getTitle只会调用一次,如果第一次是/admin的时候就会出现错误
		if (!this.props.title) this.getTitle()
	}
	//创建左侧菜单
	getMenuListNode = (menuList) =>{
	    return menuList.map((item) =>{
	        if(!item.children){
	        	return(
			        <Item key={item.key} onClick={() => {this.props.saveTitle(item.title)}}> {/*这里的item是一个一个的菜单对象,所以要写item.title*/}
				        <Link to={item.path}>
					        <Icon type={item.icon} />
					        <span>{item.title}</span>
				        </Link>
			        </Item>
		        )
	        }else {
	        	return (
			        <SubMenu
				        key={item.key}
				        title={
				        	<span>
						        <Icon type={item.icon} />
						        <span>{item.title}</span>
				        	</span>
				        }
			        >
				        {this.getMenuListNode(item.children)}
			        </SubMenu>

		        )
	        }
	    })
	};
	render() {
		let  path = this.props.location.pathname;// /admin/
		let seletedKey = path.split('/').reverse()[0];
		//如果地址中包含着/product,那么就选中商品管理
		if (path.indexOf('/product')!== -1) seletedKey ='product';
		let openKey = path.split('/').reverse(); //这是一个数组

		return (
			<div className="left-nav">
				<Link to="/admin/home" className='left-nav-header'>
					<img src={logo} alt="logo"/>
					<h1>商品管理系统</h1>
				</Link>
				<div>
					<Menu
						mode="inline"
						theme="dark"
						//defaultSelectedKeys={[seletedKey]} 这是只能是设置一次
						selectedKeys={[seletedKey]} //这个是根据最后一次的变化设置的
						defaultOpenKeys={openKey}
					>
						{this.getMenuListNode(menuList)}
					</Menu>

				</div>
			</div>
		);
	}
}

export default LeftNav;