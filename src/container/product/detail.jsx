import React, {Component} from 'react';

class Detail extends Component {
	render() {
		return (
			<div>
				商品详情页面,只能看不能修改
				<button onClick={() => {this.props.history.goBack()}}>返回</button>
			</div>
		);
	}
}

export default Detail;