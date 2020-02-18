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
	return new Promise((resolve, reject) => {
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

//请求分类列表
export const reqCategory = () => myAxios.get('/manage/category/list');
//请求更新分类列表
export const reqUpdateCategory = (categoryName) =>myAxios.post('/manage/category/add', {categoryName});