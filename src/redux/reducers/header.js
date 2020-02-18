import {SAVE_TITLE,DELETE_TITLE} from '../action_types';

export default function (preState ='', action) {
	const {type, data} = action;
	let newState;
	switch (type) {
		case SAVE_TITLE:
			newState = data;
			return newState;
		case DELETE_TITLE:
			newState = '';
			return newState;
		default:
			return preState;
	}
}