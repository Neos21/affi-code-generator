import React from 'react';

import './RakutenCode.css';

/** 楽天市場 コード */
export default class RakutenCode extends React.Component {
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
      code: `<div class="ad-rakuten">
  <div class="ad-rakuten-image">
    <a href="${state.itemUrl}">
      <img src="${state.imageUrl}">
    </a>
  </div>
  <div class="ad-rakuten-info">
    <div class="ad-rakuten-title">
      <a href="${state.itemUrl}">${state.itemName}</a>
    </div>
    <div class="ad-rakuten-shop">
      <a href="${state.shopUrl}">${state.shopName}</a>
    </div>
    <div class="ad-rakuten-price">価格 : ${state.itemPrice}円</div>
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
    <textarea id="rakuten-code" value={this.state.code} onClick={this.onClickCode} placeholder="Rakuten Code" readOnly />
  )
}
