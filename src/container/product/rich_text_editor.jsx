import React, { Component } from 'react';
import { EditorState, convertToRaw } from 'draft-js';
import {Editor} from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';

export default class RichTextEditor extends Component {
	state = {
		editorState: EditorState.createEmpty(),//初始化的编辑器
	};
	//当编辑器发生改变的时候的回调
	onEditorStateChange = (editorState) => {
		this.setState({
			editorState,
		});
	};
	//获取用户输入的富文本
	getRichText = () =>{
		const { editorState } = this.state;
		return draftToHtml(convertToRaw(editorState.getCurrentContent()))
	};
	render() {
		const { editorState } = this.state;
		return (
			<div>
				<Editor
					editorState={editorState}
					//wrapperClassName="demo-wrapper"
					//editorClassName="demo-editor"
					editorStyle={{
						border:'1px solid black',
						minHeight:'200px',
						padding:'0 10px',
						lineHeight:'15px'
					}}
					onEditorStateChange={this.onEditorStateChange}
				/>
			</div>
		);
	}
}