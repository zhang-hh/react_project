import {reqCategory} from "../../api";
import {GET_CATEGORY_LIST,ADD_CATEGORY_LIST} from '../action_types';
import {message} from "antd";
const createGetCategoryListAction = (categoryList) =>{
	return {type:GET_CATEGORY_LIST,data:categoryList}
};
//异步的action
export const createGetCategoryListAsyncAction = () =>{
	return async (dispath) => {
		//发送请求获取数据
		let result = await reqCategory();
		const {status,data,msg} = result;
		if (status=== 0) {
			dispath(createGetCategoryListAction(data))
		}else {
			message.error(msg)
		}
	}
};
export const createAddCategoryListAction = (category) =>{
	return {type:ADD_CATEGORY_LIST,data:category}
};