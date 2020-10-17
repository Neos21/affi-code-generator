import React from 'react';

import './AmazonCode.css';

/** Amazon コード */
export default class AmazonCode extends React.Component {
  /**
   * コンストラクタ
   * 
   * @param {*} props Props
   */
  constructor(props) {
    super(props);
    this.state = {
      code: ''
    }
  }
  
  /** コード欄をクリアする */
  clearCode = () => {
    this.setState({ code: '' });
  }
  
  /**
   * コードを表示する
   * 
   * @param {*} state 商品情報
   */
  showCode = (state) => {
    this.setState({
      code: `<div class="ad-amazon">
  <div class="ad-amazon-image">
    <a href="${state.detailPageUrl}">
      <img src="${state.imageUrl}" width="${state.imageWidth}" height="${state.imageHeight}">
    </a>
  </div>
  <div class="ad-amazon-info">
    <div class="ad-amazon-title">
      <a href="${state.detailPageUrl}">${state.title}</a>
    </div>
  </div>
</div>\n`  // TODO : テキストの HTML エスケープをしていない
    });
  }
  
  /**
   * コードを全選択してコピーする
   * 
   * @param {*} event イベント
   */
  onClickCode = (event) => {
    if(this.state.code === '') {
      return;
    }
    
    event.target.select();
    document.execCommand('copy');
  }
  
  /** Render */
  render = () => (
    <textarea id="amazon-code" value={this.state.code} onClick={this.onClickCode} placeholder="Amazon Code" readOnly />
  )
}
