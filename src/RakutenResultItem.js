import React from 'react';

import './RakutenResultItem.css';

/** 楽天市場 商品 */
export default class RakutenResultItem extends React.Component {
  /** 商品クリック時 */
  onClickResultItem = () => {
    this.props.callShowRakutenCode(this.props.item);
  }
  
  /** Render */
  render = () => (
    <li className="rakuten-result-item" onClick={this.onClickResultItem}>
      <div className="image"><img src={this.props.item.imageUrl} alt={this.props.item.itemName}/></div>
      <div className="name"><strong>{this.props.item.itemName}</strong></div>
      <div className="shop">{this.props.item.shopName}</div>
      <div className="price">価格 : {this.props.item.itemPrice}円</div>
    </li>
  )
}
