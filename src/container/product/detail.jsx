import React, {Component} from 'react';
import {Card, Button, Icon, List, message} from 'antd';
import {createGetCategoryListAsyncAction} from '../../redux/actions/category';
import {reqProductById} from "../../api";
import {connect} from "react-redux";
import './detail.less'
import {BASE_URL} from "../../config";
const {Item} = List;
@connect(
	(state) => ({categoryList:state.categoryList}),
	{getCategory:createGetCategoryListAsyncAction}
)
class Detail extends Component {
	state = {
		productInfo:{
			imgs: [],
			name: "",
			desc: "",
			price:0,
			categoryId: "",
			detail:'',
		},
	}
	getProductDetail = async (id) =>{
		let result = await reqProductById(id);
		const {data,status,msg} = result;
		if (!status){
			this.setState({productInfo:data});
		}
		else {
			message.error(msg)
		}
	};
	getCategoryName = (id) => {
		let result = this.props.categoryList.find((categoryObj) =>{
		    return id === categoryObj._id;
		})
		if(result) return result.name;
	}
	componentDidMount() {
		//获取商品的ID
		 const {id} = this.props.match.params;
		 if (!id) this.props.history.replace('/admin/prod_about/product')
	//	 请求详细信息
		this.getProductDetail(id)
	//	尝试从redux读取分类数据
		if (!this.props.categoryList.length) this.props.getCategory();
	}

	render() {
		const {imgs,price,name,desc,categoryId,detail} = this.state.productInfo;
		return (
			<div>
				<Card title={
					<div>
						<Button type='link' onClick={this.props.history.goBack}>
							<Icon type="arrow-left" style={{fontSize:'20px'}}/>
						</Button>
						<span>商品详情</span>
					</div>
				} >
					<List>  {/*isloading=true 可以做加载效果*/}
						<Item className="list-item">
							<span className="title">商品名称：</span>
							<span className="content">{name}</span>
						</Item>
						<Item className="list-item">
							<span className="title">商品描述：</span>
							<span className="content">{desc}</span>
						</Item>
						<Item className="list-item">
							<span className="title">商品价格：</span>
							<span className="content">{price}</span>
						</Item>
						<Item className="list-item">
							<span className="title">所属分类：</span>
							<span className="content">{this.getCategoryName(categoryId)}</span>
						</Item>
						<Item className="list-item">
							<span className="title">商品图片：</span>
							<span className="content">
								{
									imgs.map((imgName) =>{
									    return <img key={imgName} src={BASE_URL+'/upload/'+imgName} alt="商品图片"/>
									})
								}
							</span>
						</Item>
						<Item className="list-item">
							<span className="title">商品详情：</span>
							<span className="content" dangerouslySetInnerHTML={{__html:detail}}></span>
						</Item>
					</List>
				</Card>
			</div>
		);
	}
}

export default Detail;