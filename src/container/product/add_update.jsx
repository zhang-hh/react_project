import React, {Component} from 'react';
import {connect} from "react-redux";
import {createGetCategoryListAsyncAction} from '../../redux/actions/category'
import {Card, Form, Input, Icon, Select, Button, message} from 'antd';
import PicturesWall from "./pictureWall";
import RichTextEditor from "./rich_text_editor";
import {reqAddProduct, reqProductById, reqUpdateProduct} from "../../api";
const {Item} = Form;
const {Option} = Select;
@connect(
	(state)=>({categoryList:state.categoryList}),
	{getCategoryList:createGetCategoryListAsyncAction}
)
@Form.create()
/*该组件用于添加商品或者是修改页面*/
class AddUpdate extends Component {
	state = {
		currentProd:{
			_id:'',
			categoryId:'',
			name:'',
			desc:'',
			price:'',
			status:'',
		}
	};
	getProductById = async (id) =>{
		//根据id获取商品的信息
		let result = await reqProductById(id);
		const {status,msg,data} = result;
		if (!status) {
			this.setState({currentProd:data});
			this.refs.PicturesWall.setImgName(data.imgs);
			this.refs.RichTextEditor.setRichText(data.detail)
		}
		else message.error(msg);
	};
	componentDidMount() {
		if (!this.props.categoryList.length)this.props.getCategoryList();
	//	看看有没有id,若有,是修改,若没有是添加
		const {id} = this.props.match.params;
		if (id) {
			this.setState({_id:id});
		//	根据id获取商品的信息
			this.getProductById(id)
		}
	}
	//响应表单提交的
	handleSubmit = (event)=>{
		event.preventDefault();
		//获取表单数据
		this.props.form.validateFields(async(err, values) => {
			if(!err){
				let detail = this.refs.RichTextEditor.getRichText();
				let imgs = this.refs.PicturesWall.getImgNames();
				let result;
				values.detail = detail;
				values.imgs = imgs;
				const {_id} = this.state.currentProd;
				if (_id){
					values._id = _id;
					result = await reqUpdateProduct(values);
				}else {
					result = await reqAddProduct(values);
				}
				const {status,msg} = result;
				if (!status) {
					if (_id)message.success('修改成功');
					else message.success('添加商品成功');
					this.props.history.replace('/admin/prod_about/product')
				}
				else message.error(msg)
			}
		});
	};
	render() {
		const {getFieldDecorator} = this.props.form;
		const {name,desc,price,categoryId}  = this.state.currentProd;
		return (
			<Card
				title={
					<div>
						<Button type="link" onClick={this.props.history.goBack}>
							<Icon type="arrow-left"/>
							<span>返回</span>
						</Button>
						<span>商品{this.state.currentProd._id ? '修改': '添加'}</span>
					</div>}
			>
				<Form
					onSubmit={this.handleSubmit}
					labelCol={{span:2}}//调整提示的宽度
					wrapperCol={{span:7}} //调整输入的框的宽度
				>
					<Item label="商品名称">
						{getFieldDecorator('name', {
							initialValue:name||'',
							rules: [{required: true, message: '请输入商品名称' }],
						})(<Input placeholder="商品名称" />)}
					</Item>
					<Item label="商品描述">
						{getFieldDecorator('desc', {
							initialValue:desc ||'',
							rules: [{required: true, message: '请输入商品描述' }],
						})(<Input placeholder="商品描述"/>)}
					</Item>
					<Item label="商品价格">
						{getFieldDecorator('price', {
							initialValue:price ||'',
							rules: [{required: true, message: '请输入商品价格' }],
						})(<Input placeholder="商品价格" />)}
					</Item>
					<Item label="商品分类">
						{getFieldDecorator('categoryId', {
							initialValue:categoryId ||'',
							rules: [{required: true, message: '请选择一个分类' }],
						})(<Select>
							<Option value=''>请选择分类</Option>
							{
								this.props.categoryList.map((item) =>{
								    return <Option key={item._id} value={item._id}>{item.name}</Option>
								})
							}
						</Select>)}
					</Item>
					<Item label="商品图片">
						<PicturesWall ref='PicturesWall'/>
					</Item>
					<Item label="商品详情" wrapperCol={{span:10}}>
						<RichTextEditor ref='RichTextEditor'/>
					</Item>
					<Button type="primary" htmlType="submit">提交</Button>
				</Form>
			</Card>
		)
	}
}
export default AddUpdate