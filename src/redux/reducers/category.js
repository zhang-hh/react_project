import {GET_CATEGORY_LIST,ADD_CATEGORY_LIST} from '../action_types';

export default function (preState =[], action) {
	const {type, data} = action;
	let newState;
	switch (type) {
		case GET_CATEGORY_LIST:
			newState = [...data];
			return newState;
		case ADD_CATEGORY_LIST:
			return newState = [...preState,data];
		default:
			return preState;
	}
}