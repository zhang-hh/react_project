import React, {Component} from 'react';
import {Modal, Card, Button, Icon, Table, Input, Form, message} from 'antd';
import {createGetCategoryListAsyncAction,createAddCategoryListAction} from '../../redux/actions/category'
import {connect} from "react-redux";
import {PAGE_SIZE} from "../../config";
import {reqAddCategory,reqUpdateCategory} from "../../api";

const {Item} = Form;

@connect(
	(state) => ({category:state.categoryList}),
	{
		categoryList:createGetCategoryListAsyncAction,
		addCategory:createAddCategoryListAction,
	}
)
@Form.create() //向Category组件传递form属性,进行包装
class Category extends Component {
	state = { visible: false };
	//用于显示弹窗
	showModal = (category) => {
		//如果弹窗作为修改分类
		const {name,_id} = category;
		if (name&&_id){
			this.name = name;//将分类的名字存入组件的实例对象身上
			this._id = _id;//将分类的_id存到组件的实例对象身上
			this.update = true;
		}else {
			this.name = '';
			this._id = '';
			this.update = false;
		}
		this.setState({
			visible: true,
		});
	};
	//确定按钮的回调
	handleOk = () => {
		//拿到弹窗的输入,对表单的最终验证
		this.props.form.validateFields(async (err,values) =>{
			if (!err){
				let result;
				//	修改的逻辑
				if (this.update)result = await reqUpdateCategory(this._id,values.category);
				//	添加的逻辑
				//	向服务器发送请求
				// //向redux中存
				// this.props.addCategory(result.data)
				else result = await reqAddCategory(values.category);
				const {status,msg}  = result;
				if (!status){
					message.success('操作成功');
					this.props.categoryList();//获取商品的分类信息
					this.props.form.resetFields();//清空输入框,重置表单
					this.setState({visible: false});//将弹窗取消
				}else {
					message.error(msg);
				}
			}
		});
	};
	//取消按钮的回调
	handleCancel = () => {
		this.props.form.resetFields();
		this.setState({
			visible: false,
		});
	};
	componentDidMount() {
		/*1.请求商品分类信息 2.将商品分类信息存储到redux*/
		/*变成一步,一个异步action 1.分发一个获取商品分类信息的action*/
		//let result = await reqCategory() //请求返回的是一个promise实例
		//console.log(result) //走了响应拦截器的失败的回调
		this.props.categoryList();
	}

	render() {
		const {getFieldDecorator} = this.props.form;
		const dataSource = this.props.category;
		const columns = [
			//一个对象是一个列
			{
				title: '分类名',
				dataIndex: 'name',//与数据中的属性对应,这样位置就不会出错
				key: 'name',//唯一标识,名字随意
				width:'75%'
			},
			{
				title: '操作',
				//dataIndex:'name',//render中接到的参数就是由这里决定的,什么都不写的时候就是把当前的所有信息传给他
				key: 'age',
				width: '25%',
				align:'center',
				//当前列如果不是单纯的展示数据,而是要展示一些按钮,超链接等结构性东西
				// render必须是一个回调函数,他返回什么,列就会显示什么
				render:(categoryObj) => <Button type='link' onClick={() => {this.showModal(categoryObj)}}>修改分类</Button>
			},
		];

		return (
			<div>
				<Card extra={
					<Button type="primary" onClick={this.showModal}>
						<Icon type="plus-circle"/>添加
					</Button>}>
					<Table
						dataSource={dataSource} //表格数据 这里应该是写的this.props.category
						columns={columns}//表格列的信息
						bordered={true} //这里直接写borderd也行
						pagination={{
							pageSize:PAGE_SIZE,
							showQuickJumper:true
						}}//分页器,用于展示每页展示多少条数据
						rowKey="_id"//每条数据都应该有一个唯一标识,antd底层找的永远是key,只有通过该属性才能将让他去找别的
					/>
				</Card>

				{/*弹窗  新增分类,修改分类的(复用弹框)*/}
				<Modal
					title={this.update ? '修改分类':'添加分类'}//弹窗的标题
					okText='确定'
					cancelText='取消'
					visible={this.state.visible} //控制弹窗是否显示
					onOk={this.handleOk} //确定按钮的回调
					onCancel={this.handleCancel}  //取消按钮的回调
				>
				{/*	在这里我们正常想到写一个input框,
				但是普通的input框不具备验证功能,没办法对添加的分类进行验证 所以要用form表单的input*/}
					<Form onSubmit={this.handleSubmit} className="login-form">
						{/*form表单的根标签必须是Item*/}
						<Item>
							{/*声明式校验*/}
							{getFieldDecorator('category', {//想要进行校验,就有这个获取装饰域方法
								rules: [{required: true, message: '分类名不能为空'}],
								initialValue: this.name ? this.name : '' //数据回显
								})(<Input placeholder="请输入分类名" />)
							}
						</Item>
					</Form>
				</Modal>
			</div>
		);
	}
}

export default Category;