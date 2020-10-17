import React from 'react';

import './SearchForm.css';

/** 検索窓 */
export default class SearchForm extends React.Component {
  /**
   * コンストラクタ
   * 
   * @param {*} props Props
   */
  constructor(props) {
    super(props);
    this.state = {
      amazonAccessKey     : '',
      amazonSecretKey     : '',
      amazonPartnerTag    : '',
      rakutenApplicationId: '',
      rakutenAffiliateId  : '',
      keyword             : ''
    };
  }
  
  /** コンポーネント配置直後に行う処理 : クエリパラメータを初期値としてフォームに設定する */
  componentDidMount() {
    const params = [...new URLSearchParams(window.location.search)].reduce((acc, pair) => ({...acc, [pair[0]]: pair[1]}), {});
    const initialState = Object.keys(this.state).reduce((acc, stateName) => params[stateName] ? {...acc, [stateName]: params[stateName]} : acc, {});
    this.setState(initialState);
  }
  
  /**
   * テキストボックスの変更を State に反映する
   * 
   * @param {*} event イベント。テキストボックスの name 属性値を State 名と同じにしておくことで汎用化してある
   */
  onChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  }
  
  /**
   * 「一括検索」ボタンを非活性とするかチェック
   * 
   * @return 未入力欄があれば true (非活性)
   */
  isDisabledBothButton = () => {
    return this.isDisabledAmazonButton() || this.isDisabledRakutenButton();
  }
  
  /**
   * 「Amazon 検索」ボタンを非活性とするかチェック
   * 
   * @return 未入力欄があれば true (非活性)
   */
  isDisabledAmazonButton = () => {
    return !this.state.amazonAccessKey || !this.state.amazonSecretKey || !this.state.amazonPartnerTag || !this.state.keyword;
  }
  
  /**
   * 「楽天市場 検索」ボタンを非活性とするかチェック
   * 
   * @return 未入力欄があれば true (非活性)
   */
  isDisabledRakutenButton = () => {
    return !this.state.rakutenApplicationId || !this.state.rakutenAffiliateId || !this.state.keyword;
  }
  
  /** 「一括検索」ボタン押下時 */
  onClickSearchBoth = () => {
    this.onClickSearchAmazon();
    this.onClickSearchRakuten();
  }
  
  /** 「Amazon 検索」ボタン押下時 */
  onClickSearchAmazon = () => {
    this.props.callSearchAmazon({
      amazonAccessKey : this.state.amazonAccessKey,
      amazonSecretKey : this.state.amazonSecretKey,
      amazonPartnerTag: this.state.amazonPartnerTag,
      keyword         : this.state.keyword
    });
  }
  
  /** 「楽天市場 検索」ボタン押下時 */
  onClickSearchRakuten = () => {
    this.props.callSearchRakuten({
      rakutenApplicationId: this.state.rakutenApplicationId,
      rakutenAffiliateId  : this.state.rakutenAffiliateId,
      keyword             : this.state.keyword
    });
  }
  
  /** Render */
  render = () => (
    <div id="search-form">
      <div className="general">
        <h1>Affi Code Generator</h1>
        <div>
          <input type="text" name="keyword" value={this.state.keyword} placeholder="キーワード" onChange={this.onChange} />
        </div>
        <input type="button" value="一括検索" disabled={this.isDisabledBothButton()} onClick={this.onClickSearchBoth} />
      </div>
      
      <div className="amazon">
        <h2>Amazon</h2>
        <div>
          <input type="text" name="amazonAccessKey"  value={this.state.amazonAccessKey}  placeholder="アクセスキー"     onChange={this.onChange} />
          <input type="text" name="amazonSecretKey"  value={this.state.amazonSecretKey}  placeholder="シークレットキー" onChange={this.onChange} />
          <input type="text" name="amazonPartnerTag" value={this.state.amazonPartnerTag} placeholder="トラッキング ID"  onChange={this.onChange} />
        </div>
        <input type="button" value="Amazon 検索" disabled={this.isDisabledAmazonButton()} onClick={this.onClickSearchAmazon} />
      </div>
      
      <div className="rakuten">
        <h2>楽天市場</h2>
        <div>
          <input type="text" name="rakutenApplicationId" value={this.state.rakutenApplicationId} placeholder="アプリケーション ID" onChange={this.onChange} />
          <input type="text" name="rakutenAffiliateId"   value={this.state.rakutenAffiliateId}   placeholder="アフィリエイト ID"   onChange={this.onChange} />
        </div>
        <input type="button" value="楽天市場 検索" disabled={this.isDisabledRakutenButton()} onClick={this.onClickSearchRakuten} />
      </div>
    </div>
  )
}
