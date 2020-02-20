import React, {Component} from 'react';
import {Button, Card, Icon, Input, message, Select, Table} from 'antd';
import {reqProductList, reqSearchList, reqUpdateStatus} from "../../api";
import {PAGE_SIZE} from "../../config";
const {Option}  = Select;
class Product extends Component {
	state ={
		productList:[],//商品列表
		total:0,//商品总数
		keyWord:'',//关键词
		searchType:'productName'//搜索类型
	};
	//搜索和初始化商品,复用方法   原因 1:代码重复 2.下边的页码是同一个
	getProduct = async (pageNumber=1) =>{
		let result;
		//1.获取用户的输入(已经在状态里了) 2.发送请求获取数据
		const {keyWord,searchType} = this.state;
		if (keyWord) result = await reqSearchList(searchType,keyWord,pageNumber,PAGE_SIZE);
		else result = await reqProductList(pageNumber,PAGE_SIZE);
		const {status,data,msg} = result;
		if(status===0){
			const {total,list} = data;
			this.setState({
				productList:list,
				total,
			})
		}else {
			message.error(msg);
		}
	};
	//对商品进行上架和下架
	changeStatus = async (productObj) => {
		//1.如果原来状态是1就改为2,反之也是
		const {_id} = productObj;
		let _status = productObj.status;
		if (_status === 1) _status = 2;
		else _status = 1;
		let result = await reqUpdateStatus(_id, _status);
		const {status, msg} = result;//解析回来的数据
		if (!status) {
			message.success('操作成功');
			//刷新商品列表
			this.getProduct();
		}
		else message.error(msg);
	};
	//组件一挂载就像服务器发送请求拿到商品数据
	componentDidMount() {
		this.getProduct()
	}

	render() {
		//模拟表格的数据
		//表格的列设置(重要)
		const columns = [
			{
				title: '商品名称',
				dataIndex: 'name',
				key: 'name',
				width:'20%'
			},
			{
				title: '商品描述',
				dataIndex: 'desc',
				key: 'desc',
			},
			{
				title: '价格',
				dataIndex: 'price',
				key: 'price',
				width:'10%',
				align:'center',
				render:(p) =>'￥'+p
			},
			{
				title: '状态',
				key: 'status',
				align:'center',
				width:'13%',
				render:(productObj) => {
					return (
						<div>
							<Button
								onClick={()=>{this.changeStatus(productObj)}}
								type={productObj.status === 1 ? 'danger':'primary'}
							>{productObj.status === 1 ? '下架' : '上架'}
							</Button><br/>
							<span>{productObj.status === 1 ? '当前状态：在售' : '当前状态：已停售'}</span>
						</div>
					)
				}
			},
			{
				title: '操作',
				//dataIndex: 'opera',
				key: 'opera',
				align:'center',
				width:'7%',
				render:(product) => <div><Button onClick={() =>{this.props.history.push(`/admin/prod_about/product/detail/${product._id}`)}} type="link">详情</Button><Button onClick={() =>{this.props.history.push(`/admin/prod_about/product/add_update/${product._id}`)}} type="link">修改</Button></div>
			},
		];
		return (
			<div>
				<Card
					title={
						<div>
							<Select value={this.state.searchType} id="" onChange={(value) => {this.setState({searchType:value})}}>
								<Option value="productName">按名称搜索</Option>
								<Option value="productDesc">按描述搜索</Option>
							</Select>
							<Input allowClear style={{width:'20%', margin:'0 10px'}} placeholder='请输入关键字' onChange={(event) => {this.setState({keyWord:event.target.value})}}/>
							<Button onClick={() => {this.getProduct()}} type="primary"><Icon type="search"/>搜索</Button>
						</div>
					}
				    extra={<Button onClick={() => {this.props.history.push('/admin/prod_about/product/add_update')}} type="primary"><Icon type="plus-circle" />添加商品</Button>}
				>
					<Table
						dataSource={this.state.productList}
						columns={columns}
						bordered
						rowKey = "_id"
						pagination={{ //分页器
							total:this.state.total,//服务器一共多少数据
							pageSize:PAGE_SIZE, //每页展示多少条数据
							onChange:(number) => {this.getProduct(number)},//用户点击的页码发生变化时候掉用
						}}
					/>
				</Card>
			</div>
		);
	}
}

export default Product;