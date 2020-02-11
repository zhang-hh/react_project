import React, {Component} from 'react';
import { Form, Icon, Input, Button } from 'antd';
import logo from './img/logo.png'; //引入图片要用一个变量去接
import './css/login.less';
const {Item} = Form;//从Form身上拿到Item
class Login extends Component {
	/*
			用户名/密码的的合法性要求
				1). 必须输入
				2). 必须大于等于4位
				3). 必须小于等于12位
				4). 必须是英文、数字或下划线组成
		*/
	/*自定义密码校验器
	validator这个属性的属性值是一个函数,只要密码发生变换的时候,就会调用
	接收三个参数,rule.value,callback,rule是底层的我们并不关注,value是输入的值
	注意是callback要被调用,当用户输入不合法的时候显示提示文本
	*/
	passwordValidator = (rule,value,callback) =>{
		if(!value){
			callback('密码必须输入')
		}else if(value.length < 4){
			callback('密码必须大于等于4位')
		}else if(value.length>12){
			callback('密码必须小于等于12位')
		}else if(!(/^\w+$/.test(value))){
			callback('密码必须是英文、数字或下划线组成')
		}else {
			callback()
		}
	}
	//响应表单的提交
	handleSubmit = (event) =>{
	    event.preventDefault();//阻止表单提交的默认行为
	//	获取表单的用户输入
		this.props.form.validateFields((err, values) => {
			if (!err){
				//如果输入的用户名和密码均没有问题,发送网络请求
				console.log('发送网络请求', values);
			}
		})
	}
	render() {
		const { getFieldDecorator } = this.props.form;//通过From.create加工了新组件,加工之后向Login传递了form属性
		return (
			<div id="login">
				<header className="header">
					<img src={logo} alt="logo"/>
					<h1>商品管理系统</h1>
				</header>
				<div className="content">
					<h1>用户登录</h1>
					<Form onSubmit={this.handleSubmit} className="login-form">
						<Item>
							{/*getFieldDecorator('给要装饰的域起个名字',{rules:[{规则1},{规则2}]})(要装饰的内容)*/}
							{/*
								用户名/密码的的合法性要求
									1). 必须输入
									2). 必须大于等于4位
									3). 必须小于等于12位
									4). 必须是英文、数字或下划线组成
							*/}
							{/*声明式校验*/}
							{getFieldDecorator('username', {//想要进行校验,就有这个获取装饰域方法
								rules: [
									{ required: true, message: '请输入你的用户名!' },
									{max:12,message: '用户名长度不超过12位'},
									{min:4,message:'用户名长度不小于4位'},
									{pattern:/^\w+$/,message:'用户名必须是英文、数字或下划线'}
									]
							})(
								<Input
									prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
									placeholder="用户名"
								/>,
							)}
						</Item>
						<Item>
							{/*密码的自定义校验 属性值是validator*/}
							{getFieldDecorator('password', {
								rules: [
									{validator:this.passwordValidator}
								],
							})(
								<Input
									prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
									type="password"
									placeholder="密码"
								/>,
							)}
						</Item>
						<Item>
							<Button type="primary" htmlType="submit" className="login-form-button">
								登录
							</Button>
						</Item>
					</Form>
				</div>
			</div>
		);
	}
}
//Form.create()的返回值依然是一个函数,该函数接收一个组件,随后生成一个新组件,我们渲染那个新组件
//Form.create()返回方法是能够加工组件,生成的新组件多了一个特别的属性:form,然后将from属性传给了加工后的Login组件
export default Form.create()(Login);//WrappedLogin是一个新的组件
