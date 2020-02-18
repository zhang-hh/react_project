import {SAVE_TITLE,DELETE_TITLE} from '../action_types'
export const createSaveTitleAction = (title) =>{ //这里接到的就是一个titile的文字,不是对象
	return {type:SAVE_TITLE,data:title}//这里接到的就是一个titile的文字,不是对象,这里也不用在.title了
};
export const createDeleteTitleAction = () =>{
    return {type:DELETE_TITLE,data:''}
};