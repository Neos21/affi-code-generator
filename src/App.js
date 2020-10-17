import React from 'react';

import SearchForm from './SearchForm';
import AmazonResults from './AmazonResults';
import AmazonCode from './AmazonCode';
import RakutenResults from './RakutenResults';
import RakutenCode from './RakutenCode';

import getValue from './lib/get-value';
import searchAmazon from './lib/search-amazon';
import searchRakuten from './lib/search-rakuten';

import './App.css';

/** アプリホーム */
export default class App extends React.Component {
  /**
   * コンストラクタ
   * 
   * @param {*} props Props
   */
  constructor(props) {
    super(props);
    this.amazonResults = React.createRef();
    this.amazonCode    = React.createRef();
    this.rakutenResults = React.createRef();
    this.rakutenCode    = React.createRef();
  }
  
  /**
   * 「Amazon 検索」イベントを中継する
   * 
   * @param {*} state 子コンポーネントから送られてきたデータ
   */
  callSearchAmazon = async (state) => {
    try {
      this.amazonCode.current.clearCode();
      this.amazonResults.current.onSearching();
      
      const amazonResults = await searchAmazon(state);
      console.log('callSearchAmazon : Success', amazonResults);
      this.amazonResults.current.showResults(amazonResults);
    }
    catch(error) {
      console.log('callSearchAmazon : Failed', error);
      const errorMessage = (() => {
        if(getValue(error, 'details.response.text')) {
          return 'API エラー : ' + getValue(error, 'details.response.text');
        }
        return getValue(error, 'error') || error.toString();
      })();
      this.amazonResults.current.onError(errorMessage);
    }
  }
  
  /**
   * 「楽天市場 検索」イベントを中継する
   * 
   * @param {*} state 子コンポーネントから送られてきたデータ
   */
  callSearchRakuten = async (state) => {
    try {
      this.rakutenCode.current.clearCode();
      this.rakutenResults.current.onSearching();
      
      const rakutenResults = await searchRakuten(state);
      console.log('callSearchRakuten : Success', rakutenResults);
      this.rakutenResults.current.showResults(rakutenResults);
    }
    catch(error) {
      console.log('callSearchRakuten : Failed', error);
      const errorMessage = (() => {
        if(getValue(error, 'error')) {
          if(getValue(error, 'error_description')) {
            return 'Error : ' + getValue(error, 'error') + ' … ' + getValue(error, 'error_description');
          }
          return 'Error : ' + getValue(error, 'error');
        }
        return error.message || error.toString();
      })();
      this.rakutenResults.current.onError(errorMessage);
    }
  }
  
  /**
   * 選択した Amazon 商品の HTML コードを表示する
   * 
   * @param {*} state 子コンポーネントから送られてきたデータ
   */
  callShowAmazonCode = (state) => {
    this.amazonCode.current.showCode(state);
  }
  
  /**
   * 選択した 楽天市場 商品の HTML コードを表示する
   * 
   * @param {*} state 子コンポーネントから送られてきたデータ
   */
  callShowRakutenCode = (state) => {
    this.rakutenCode.current.showCode(state);
  }
  
  /** Render */
  render = () => (
    <div id="app">
      <div className="search-form-area">
        <SearchForm callSearchAmazon={this.callSearchAmazon} callSearchRakuten={this.callSearchRakuten} />
      </div>
      <div className="results-codes-area">
        <div className="amazon-results-area">
          <AmazonResults ref={this.amazonResults} callShowAmazonCode={this.callShowAmazonCode} />
        </div>
        <div className="rakuten-results-area">
          <RakutenResults ref={this.rakutenResults} callShowRakutenCode={this.callShowRakutenCode} />
        </div>
        <div className="codes-area">
          <AmazonCode ref={this.amazonCode} />
          <RakutenCode ref={this.rakutenCode} />
        </div>
      </div>
    </div>
  )
}
