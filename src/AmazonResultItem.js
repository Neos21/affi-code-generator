import React from 'react';

import './AmazonResultItem.css';

/** Amazon 商品 */
export default class AmazonResultItem extends React.Component {
  /** 商品クリック時 */
  onClickResultItem = () => {
    this.props.callShowAmazonCode(this.props.item);
  }
  
  /** Render */
  render = () => (
    <li className="amazon-result-item" onClick={this.onClickResultItem}>
      <div className="image"><img src={this.props.item.imageUrl} alt={this.props.item.title}/></div>
      <div className="name"><strong>{this.props.item.title}</strong></div>
      <div className="price">価格 : {this.props.item.price}円</div>
    </li>
  )
}
