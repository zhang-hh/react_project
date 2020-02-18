import React, {Component} from 'react';
import {Button,Icon,Modal} from 'antd';
import dayjs from 'dayjs';
import {connect} from 'react-redux';
import screenfull from "screenfull";
//因为要操作状态,所以引入action
import {createDeleteUserInfoAction} from '../../redux/actions/login';
import {createDeleteTitleAction} from '../../redux/actions/header'
import {reqWeather} from '../../api'
import './header.less';
const { confirm } = Modal;
@connect(
	(state) =>({userInfo:state.userInfo,title:state.headerTitle}),//映射状态 通过this.props
	{
		deleteUserInfo:createDeleteUserInfoAction,
		deleteTitle:createDeleteTitleAction
	} //映射操作状态的方法
)
class Header extends Component {
	state = {
		isFull:false,
		//dayjs调用假如传了时间戳就将那个传递进去的时间戳转换格式,如果没有传底层就会调用当前时间
		date:dayjs().format('YYYY年MM月DD日 HH:mm:ss A'),
		weather:{pic:'',temp:''}
	};
	fullscreen =() =>{
		screenfull.toggle();
	};
	//退出登录
	logout = () =>{
		confirm({
			title: '你确定退出么?',
			content: '退出后需要重新登录',
			cancelText:'取消',
			okText:'确定',
			onOk:()=>{
				//操作redux的状态退出登录
				this.props.deleteUserInfo();
				this.props.deleteTitle();
			},
			//对象的简写方式
			onCancel() {},
		});
	};
	getWeatherData = async() =>{
		let weather = await reqWeather();
		const {dayPictureUrl, temperature} = weather;
		this.setState({weather:{pic: dayPictureUrl,temp: temperature}})
	};
	componentDidMount() {
		//检测全屏状态
		screenfull.on('change', () => {
			const isFull = !this.state.isFull;
			this.setState({isFull})
		});
	//	实时更新时间 将这个id放在this身上cxc拿到id
		 this.timeId = setInterval(() =>{
		    this.setState({date:dayjs().format('YYYY年MM月DD日 HH:mm:ss A')})
		},1000);
	//	发送ajax请求,获取天气数据
		this.getWeatherData();
	}
	componentWillUnmount() {
		clearInterval(this.timeId)
	}

	render() {
		const {username} = this.props.userInfo.user;
		return (
			<div className="header">
				<div className="top">
					<Button onClick={this.fullscreen} size="small">
						<Icon type={this.state.isFull ? 'fullscreen-exit':'fullscreen'} />
					</Button>
					<span>欢迎{username}</span>
					<Button type="link" onClick={this.logout}>退出登录</Button>
				</div>
				<div className="bottom">
					<div className="bottom-left">
						<span>{this.props.title}</span>
					</div>
					<div className="bottom-right">
						<span>{this.state.date}</span>
						<img src={this.state.weather.pic} alt="天气"/>
						<span>温度:{this.state.weather.temp}</span>
					</div>
				</div>
			</div>
		);
	}
}

export default Header;