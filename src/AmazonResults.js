import React from 'react';

import AmazonResultItem from './AmazonResultItem';

import './AmazonResults.css';

/** Amazon 検索結果表示欄 */
export default class AmazonResults extends React.Component {
  /**
   * コンストラクタ
   * 
   * @param {*} props Props
   */
  constructor(props) {
    super(props);
    this.state = {
      isSearching: false,
      results: [],
      errorMessage: ''
    }
  }
  
  /** 検索処理を開始する */
  onSearching = () => {
    this.setState({
      isSearching: true,
      results: [],
      errorMessage: ''
    });
  }
  
  /**
   * 検索結果を表示する
   * 
   * @param {Array<*>}} results 検索結果の配列
   */
  showResults = (results) => {
    this.setState({
      isSearching: false,
      results: results,
      errorMessage: ''
    });
  }
  
  /**
   * エラーメッセージを表示する
   * 
   * @param {string} errorMessage エラーメッセージ
   */
  onError = (errorMessage) => {
    this.setState({
      isSearching: false,
      results: [],
      errorMessage: errorMessage
    });
  }
  
  /**
   * 子コンポーネントから親コンポーネントにイベントを伝搬する
   * 
   * @param {*} state 商品情報
   */
  callShowAmazonCode = (state) => {
    this.props.callShowAmazonCode(state);
  }
  
  /** Render */
  render = () => (
    <div id="amazon-results">
      {
        ((this.state.results == null || this.state.results.length === 0) && !this.state.isSearching && (this.state.errorMessage == null || this.state.errorMessage === '')) && (
          <div className="message">検索してください</div>
        )
      }
      {
        (this.state.isSearching) && (
          <div className="message warn-message">検索中…</div>
        )
      }
      { (this.state.errorMessage != null && this.state.errorMessage !== '') && (
          <div className="message error-message">{this.state.errorMessage}</div>
        )
      }
      {
        (this.state.results != null && this.state.results.length > 0) && (
          <div className="results">
            { this.state.results.map(item => (<AmazonResultItem key={item.id} item={item} callShowAmazonCode={this.callShowAmazonCode} />)) }
          </div>
        )
      }
    </div>
  )
}
