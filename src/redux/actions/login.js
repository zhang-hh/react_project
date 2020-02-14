import {SAVE_USERINFO,DELETE_USERINFO} from '../action_types'
export const createSaveUserInfoAction = (personObj) =>{
	//向sessiontorage里面保存信息,防止刷新后redux数据丢失
	const {user,token} = personObj;
	localStorage.setItem("user",JSON.stringify(user));
	localStorage.setItem("token",token);
	return {type:SAVE_USERINFO,data:personObj}
};
export const createDeleteUserInfoAction = () =>{
    localStorage.clear();
    return {type:DELETE_USERINFO,data:''}
};