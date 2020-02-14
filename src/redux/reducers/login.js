import {SAVE_USERINFO,DELETE_USERINFO} from '../action_types';
/*尝试从sessionStorage中读取用户信息
*   第一种情况:读取到了,用户登录过,用读取出来的数据初始化redux保存的state
*   第二种情况:未读取到,用户未登录过,或者是登录过但是手动情空sessionStorage中的数据,初始化了一个空的state
* */
const _user = JSON.parse(localStorage.getItem('user'));
const _token = localStorage.getItem('token');
let initState = {
	user: _user || {},
	token: _token || '',
	//isLogin: (_user && _token) ? true : false
	isLogin: !!(_user && _token)
};
export default function (preState = initState, action) {
	const {type, data} = action;
	let newState;
	switch (type) {
		case SAVE_USERINFO:
			const {user, token} = data;
			newState = {user, token, isLogin: true};
			return newState;
		case DELETE_USERINFO:
			newState = {user:{}, token:'', isLogin:false};
			return newState;
		default:
			return preState;
	}
}