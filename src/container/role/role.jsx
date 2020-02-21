import React, {Component} from 'react';
import {Button, Card, Icon, Table, Modal, Input, Form, message,Tree} from 'antd';
import dayjs from "dayjs";
import {reqAddRole, reqRoleList, reqUpdteRole} from "../../api";
import menus from '../../config/menu-config';
import {connect} from "react-redux";
const {Item}  = Form;
const { TreeNode } = Tree;

@connect(
	(state) => ({name:state.userInfo.user.username}),
	{}
)
@Form.create()
class Role extends Component {
	state = {
		isShowAdd: false,
		isShowAuth:false,
		roleList:[],//角色列表(从服务器拿回来的)
		checkedKeys: [],//勾选的菜单
	};
	//展示弹窗
	showAdd = () => {
		this.setState({
			isShowAdd: true,
		});
	};
	//展示授权框
	showAuth = (id) =>{
		this._id = id;
		//根据角色id查询角色信息
		let result = this.state.roleList.find((roleObj) =>{
		    return roleObj._id === id;
		});
		//做到了数据回显
		if (result)this.setState({isShowAuth: true,checkedKeys:result.menus});
	};
	//新增角色的确认回调
	handleAddOk = () => {
		this.props.form.validateFields(async (err,values) =>{
			if (!err){
				let result = reqAddRole(values.role);
				this.props.form.resetFields();//清空输入框,重置表单
				this.setState({isShowAdd: false});//将输入框隐藏
				const {status,msg} = result;
				if (!status) {
					message.success('添加角色成功')
					this.getRoleList()
				}else message.error(msg)
			};
			this.setState({isShowAdd: false});//将输入框隐藏
		})
	};
	//新增角色的取消回调
	handleAddCancel = () => {
		this.setState({
			isShowAdd: false,
		});
	};
	//授权的确定回调
	handleAuthOk = async () => {
		const _id = this._id;
		const menus = this.state.checkedKeys;
		const {name} = this.props;
		let result = await reqUpdteRole(_id,menus,name);
		const {status,msg} = result;
		if (!status) {
			message.success('授权成功');
			this.setState({isShowAuth: false});
			this.getRoleList()
		}
		else message.error(msg);
	};
	//授权的取消回调
	handleAuthCancel = () => {
		this.setState({
			isShowAuth: false,
		});
	};
	getRoleList = async () =>{
		let result = await reqRoleList();
		const {status,data,msg} = result;
	    if (status===0) this.setState({roleList:data})
	    else message.error(msg)
	};
	componentDidMount() {
		this.getRoleList()
	}
	//当勾选了的回调
	onCheck = checkedKeys => {
		this.setState({ checkedKeys });
	};
	//根据数据,渲染树形结构
	renderTreeNodes = data =>
		data.map(item => {
			if (item.children) {
				return (
					<TreeNode title={item.title} key={item.key} dataRef={item}>
						{this.renderTreeNodes(item.children)}
					</TreeNode>
				);
			}
			return <TreeNode key={item.key} {...item} />;
		});
	render() {
		const columns = [
			{
				title: '角色名称',
				dataIndex: 'name',
				key: 'name',
			},
			{
				title: '创建时间',
				dataIndex: 'create_time',
				key: 'create_time',
				render: (create_time) => dayjs(create_time).format('YYYY年MM月DD日 HH:mm:ss'),
	},
			{
				title: '授权时间',
				dataIndex: 'auth_time',
				key: 'auth_time',
				render: (auth_time) => auth_time ? dayjs(auth_time).format('YYYY年MM月DD日 HH:mm:ss'):'',

			},
			{
				title: '授权人',
				dataIndex: 'auth_name',
				key: 'auth_name',
				align:"center"
			},
			{
				title: '操作',
				dataIndex: '_id',
				key: 'opera',
				align:"center",
				render: (id) => <Button onClick={() => {this.showAuth(id)}} type="link">设置权限</Button>
			}
		];
		const { getFieldDecorator } = this.props.form;//通过From.create加工了新组件,加工之后向Login传递了form属性
		return (
			<div>
				<Card title={
					<Button type="link" onClick={this.showAdd}>
						<Icon type="plus-circle" />新增角色
					</Button>
				}>
					<Table
						dataSource={this.state.roleList}
						columns={columns}
						bordered
						rowKey='_id'
					/>
					{/*新增角色弹窗*/}
					<Modal
						title="Basic Modal"
						visible={this.state.isShowAdd}
						onOk={this.handleAddOk}
						onCancel={this.handleAddCancel}
						okText="确认"
						cancelText="取消"
					>
						<Form onSubmit={this.handleSubmit} className="login-form">
							<Item>
								{/*声明式校验*/}
								{getFieldDecorator('role', {//想要进行校验,就有这个获取装饰域方法
									rules: [{ required: true, message: '角色名必须输入!' }]
								})(
									<Input placeholder="角色名"/>,
								)}
							</Item>
						</Form>
					</Modal>
					{/*授权弹窗*/}
					<Modal
						title="Basic Modal"
						visible={this.state.isShowAuth}
						onOk={this.handleAuthOk}
						onCancel={this.handleAuthCancel}
						okText="确认"
						cancelText="取消"
					>
						<Tree
							defaultExpandAll
							checkable //控制每个树的节点是否被选中
							//onExpand={this.onExpand} //当展开一个节点时的回调
							//expandedKeys={this.state.expandedKeys} //展开了那些节点
							//autoExpandParent={this.state.autoExpandParent} //自动展开父节点
							onCheck={this.onCheck} //当勾选一个节点的回调
							checkedKeys={this.state.checkedKeys} //已经勾选了的节点
							//onSelect={this.onSelect} //当选择一个节点时的回调
							//selectedKeys={this.state.selectedKeys}  //已经选择的节点 勾选是勾了前边的框,选择是指点击了这个选项
						>
							{/*渲染树*/}
							{this.renderTreeNodes(menus)}
						</Tree>
					</Modal>
				</Card>
			</div>
		);
	}
}

export default Role;