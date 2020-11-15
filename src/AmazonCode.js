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
    const url   = state.detailPageUrl.replace((/&/gu), '&amp;');
    const title = state.title.replace((/&/gu), '&amp;').replace((/"/gu), '&quot;').replace((/</gu), '&lt;').replace((/>/gu), '&gt;')
    this.setState({
      code: `<div class="ad-amazon">
  <div class="ad-amazon-image">
    <a href="${url}">
      <img src="${state.imageUrl}" width="${state.imageWidth}" height="${state.imageHeight}">
    </a>
  </div>
  <div class="ad-amazon-info">
    <div class="ad-amazon-title">
      <a href="${url}">${title}</a>
    </div>
  </div>
</div>\n`
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
