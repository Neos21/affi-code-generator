import React from 'react';

import getValue from './lib/get-value';

import './App.css';

class Item extends React.Component {
  render() {
    return (
      <li className="item">
        <div className="item-image"><img src={this.props.item.imageUrl} /></div>
        <div className="item-name"><a href={this.props.item.itemUrl}><strong>{this.props.item.itemName}</strong></a></div>
        <div className="item-shop"><a href={this.props.item.shopUrl}>{this.props.item.shopName}</a></div>
        <div className="item-price">価格 : {this.props.item.itemPrice}円</div>
      </li>
    );
  }
}

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      applicationId: process.env.REACT_APP_APPLICATION_ID,
      affiliateId: process.env.REACT_APP_AFFILIATE_ID,
      items: [],
      errorMessage: ''
    };
    this.inputText = React.createRef();
  }
  
  search = () => {
    this.setState({
      items: [],
      errorMessage: ''
    });
    
    if(!this.inputText.current.value) {
      return this.setState({ errorMessage: '検索キーワードを入力してください' });
    }
    
    const applicationId = this.state.applicationId;
    const affiliateId   = this.state.affiliateId;
    const inputText     = this.inputText.current.value;
    const keyword       = encodeURIComponent(inputText);
    fetch(`https://app.rakuten.co.jp/services/api/IchibaItem/Search/20170706?format=json&keyword=${keyword}&applicationId=${applicationId}&affiliateId=${affiliateId}`)
      .then(response => response.json())
      .then(data => {
        if(!getValue(data, 'Items')) {
          const responseMessage = getValue(data, 'error_description') || getValue(data, 'error') || '不明なエラー';
          console.warn('データの取得に失敗しました', responseMessage, data);
          return this.setState({ errorMessage: `データの取得に失敗しました : [${responseMessage}]` });
        }
        else if(!data.Items.length) {
          console.warn(`キーワード「${inputText}」を含む商品は見つかりませんでした`);
          return this.setState({ errorMessage: `キーワード「${inputText}」を含む商品は見つかりませんでした` });
        }
        
        this.setState({
          items: data.Items.map((item, index) => ({
            id              : index,
            itemName        : getValue(item, 'Item.itemName'),
            itemUrl         : getValue(item, 'Item.affiliateUrl'),  // itemUrl は同じ値
            itemPrice       : getValue(item, 'Item.itemPrice'),
            shopName        : getValue(item, 'Item.shopName'),
            shopUrl         : getValue(item, 'Item.shopAffiliateUrl'),  // shopUrl は同じ値
            imageUrl        : getValue(item, 'Item.mediumImageUrls.0.imageUrl')
          }))
        });
      })
      .catch(error => {
        console.error(error);
        this.setState({ errorMessage: error.toString() });
      });
  }
  
  render() {
    return (
      <div id="app">
        <h1 className="title">楽天商品検索</h1>
        <ul>
          <li>アプリケーション ID : {this.state.applicationId}</li>
          <li>アフィリエイト ID : {this.state.affiliateId}</li>
        </ul>
        <p className="search-form">
          <input type="text" ref={this.inputText} className="input-text" />
          <input type="button" value="検索" onClick={this.search} className="search-button" />
        </p>
        
        { (this.state.items && this.state.items.length > 0) &&
          <ul className="item-list">
            { this.state.items.map(item => (<Item key={item.id} item={item} />)) }
          </ul>
        }
        
        { this.state.errorMessage &&
          <p className="error-message">{this.state.errorMessage}</p>
        }
      </div>
    );
  }
}
