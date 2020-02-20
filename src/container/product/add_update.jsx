import React, {Component} from 'react';
import {connect} from "react-redux";
import {createGetCategoryListAsyncAction} from '../../redux/actions/category'
import {Card, Form, Input, Icon, Select, Button, message} from 'antd';
import PicturesWall from "./pictureWall";
import RichTextEditor from "./rich_text_editor";
import {reqAddProduct} from "../../api";
const {Item} = Form;
const {Option} = Select;
@connect(
	(state)=>({categoryList:state.categoryList}),
	{getCategoryList:createGetCategoryListAsyncAction}
)
@Form.create()
class AddUpdate extends Component {
	componentDidMount() {
		if (!this.props.categoryList.length)this.props.getCategoryList()
	}

	//响应表单提交的
	handleSubmit = (event)=>{
		event.preventDefault();
		//获取表单数据
		this.props.form.validateFields(async (err, values) => {
			if(!err){
				let detail = this.refs.RichTextEditor.getRichText();
				let imgs = this.refs.PicturesWall.getImgName();
				values.detail = detail;
				values.imgs = imgs;
				let result = await reqAddProduct(values);
				const {status,msg} = result;
				if (!status) {
					message.success('添加商品成功');
					this.props.history.replace('/admin/prod_about/product')
				}
				else message.error(msg)

			}
		});
	};
	render() {
		const {getFieldDecorator} = this.props.form;
		return (
			<Card
				title={
					<div>
						<Button type="link" onClick={this.props.history.goBack}>
							<Icon type="arrow-left"/>
							<span>返回</span>
						</Button>
						<span>商品添加</span>
					</div>}
			>
				<Form
					onSubmit={this.handleSubmit}
					labelCol={{span:2}}//调整提示的宽度
					wrapperCol={{span:7}} //调整输入的框的宽度
				>
					<Item label="商品名称">
						{getFieldDecorator('name', {
							rules: [{required: true, message: '请输入商品名称' }],
						})(<Input placeholder="商品名称" />)}
					</Item>
					<Item label="商品描述">
						{getFieldDecorator('desc', {
							rules: [{required: true, message: '请输入商品描述' }],
						})(<Input placeholder="商品描述"/>)}
					</Item>
					<Item label="商品价格">
						{getFieldDecorator('price', {
							rules: [{required: true, message: '请输入商品价格' }],
						})(<Input placeholder="商品价格" />)}
					</Item>
					<Item label="商品分类">
						{getFieldDecorator('categoryId', {
							initialValue:'',
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