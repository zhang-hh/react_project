/*该文件用于保存所有发送ajax请求的方法:即项目中的所有的ajax请求
* 都要在文件中准备一个请求函数*/
import myAxios from './myAxios';

export const reqLogin = (username,password) => myAxios.post('/login', {username, password});