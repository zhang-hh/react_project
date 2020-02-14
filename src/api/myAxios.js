/*此文件是对axios的二次封装*/
import axios from 'axios';
//引入querystring,用于转换请求参数
import qs from 'querystring';
//引入antd
import {message} from 'antd';
//引入NProgress进度条
import Nprogress from 'nprogress';
//引入进度条的样式
import 'nprogress/nprogress.css';
//引入请求的默认路径
import {BASE_URL} from '../config';
axios.defaults.baseURL = BASE_URL;
//使用axios的请求拦截器 ---安检
axios.interceptors.request.use((config) =>{
	//config是是配置对象,里面包含着是本次请求的必要信息,比如请求方式,请求的地址
	//如果是post请求,并且请求体的参数是json格式的数据,
	// 向服务器发请求之前就会将它的参数改为urlencoded形式的
	Nprogress.start();
	const {method,data} = config;
	if (method.toUpperCase() === 'POST' && data instanceof Object){
		config.data = qs.stringify(data)
	}
	return config;
});
axios.interceptors.response.use(
	(response) => {
	//如果响应的状态码是以2开头,axios认为响应就是成功的
		Nprogress.done();
		return response.data;
	},
	() => {
		//console.log('响应失败',err.message); undefined 是非promise实例,所有在发请求的那边就会是成功的回调
		/*这样写,会触发axios发送请求失败的回调*/
		//return Promise.reject(err)
	//	由响应拦截器统一处理错误
	//	这样写不会触发.axios发送请求失败的回调
		Nprogress.done();
		message.error('请求失败,请联系管理员');
		return new Promise(() => {});
	}
);
export default axios;
