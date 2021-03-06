/*该文件用于保存所有发送ajax请求的方法:即项目中的所有的ajax请求
* 都要在文件中准备一个请求函数*/
import myAxios from './myAxios';
import {message} from 'antd';
import jsonp from 'jsonp';
import {WEATHER_URL, WEATHER_AK} from '../config/index'
//请求登录接口
export const reqLogin = (username, password) =>
	myAxios.post('/login', {username, password});
//请求天气接口
export const reqWeather = () => {
	const url = `${WEATHER_URL}?location=张北&output=json&ak=${WEATHER_AK}`;
	//jsonp 里面的回调是异步回调,直接就return了
	return new Promise((resolve) => {
		jsonp(url, (err, data) => {
			if (!err) {
				const {dayPictureUrl, temperature} = data.results[0].weather_data[0];
				const weatherObj = {dayPictureUrl, temperature};
				resolve(weatherObj);
			} else {
				//由于是jsonp发的请求,那么就会不能用axios拦截器弹窗
				message.error('请求天气数据出错,请联系管理员')
			}
		})

	})

};
//请求分类列表(假分页)
export const reqCategory = () => myAxios.get('/manage/category/list');
//请求添加分类列表
export const reqAddCategory = (categoryName) =>myAxios.post('/manage/category/add', {categoryName});
//请求更新分类列表
export const reqUpdateCategory = (categoryId,categoryName) =>myAxios.post('/manage/category/update', {categoryId,categoryName});
//请求商品分页列表(真分页)
export const reqProductList = (pageNum,pageSize) =>myAxios.get('/manage/product/list', {params:{pageNum,pageSize}});
//搜索产品分页列表
export const reqSearchList = (searchType,keyWord,pageNum,pageSize) =>
	myAxios.get('/manage/product/search', {params:{[searchType]:keyWord,pageNum,pageSize}});
// 对商品进行上架/下架处理
export const reqUpdateStatus = (productId,status) =>myAxios.post('/manage/product/updateStatus', {productId,status});
//删除商品图片
export const reqDeletePicture = (name) => myAxios.post('/manage/img/delete',{name});
//添加商品
export const reqAddProduct = (productObj) => myAxios.post('/manage/product/add',productObj);
//根据商品ID获取商品的信息
export const reqProductById = (productId) =>myAxios.get('/manage/product/info', {params:{productId}});
//修改商品 比添加商品多了一个_id
export const reqUpdateProduct = (productObj) => myAxios.post('/manage/product/update',productObj);
//获取角色列表
export const reqRoleList = () =>myAxios.get('/manage/role/list');
//添加角色
export const reqAddRole = (roleName) => myAxios.post('/manage/role/add',{roleName});
//更新角色(给角色设置权限)
export const reqUpdteRole = (_id,menus,auth_name) => myAxios.post('/manage/role/update',{_id,auth_name,menus,auth_time:Date.now()});
//获取所有用户列表
export const reqUserList = () =>myAxios.get('/manage/user/list');
//添加用户
export const reqAddUser = (userObj) => myAxios.post('/manage/user/add',userObj);
