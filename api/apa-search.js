const amazonPaapi = require('amazon-paapi');

import getValue from '../src/lib/get-value';

/**
 * リクエストパラメータを検証する
 * 
 * @param {*} reqBody リクエストボディ
 * @return {boolean} 不正なパラメータがあれば true
 */
const isInvalid = (reqBody) => {
  const isEmpty = (param) => param == null || `${param}`.trim() === '';
  return isEmpty(reqBody.accessKey) || isEmpty(reqBody.secretKey) || isEmpty(reqBody.partnerTag) || isEmpty(reqBody.keyword);
};

/**
 * Amazon PA API をコールする。3回失敗した場合は Reject する
 * 
 * @param {*} commonParameters 共通パラメータ
 * @param {*} requestParameters リクエストパラメータ
 * @return {Promise<*>} API コール結果
 * @throws API コールに3回失敗した場合、最後の API コールの失敗情報
 */
const search = async (commonParameters, requestParameters) => {
  const searchPromise = () => amazonPaapi.SearchItems(commonParameters, requestParameters);
  console.log('apa-search : Exec Search');
  return searchPromise()
    .catch(error => {
      console.warn('apa-search : Failed 1, Retry', error);
      return searchPromise();
    })
    .catch(error => {
      console.warn('apa-search : Failed 2, Retry', error);
      return searchPromise();
    })
    .catch(error => {
      console.warn('apa-search : Failed 3, Aborted', error);
      return Promise.reject(error);
    });
};

/**
 * Amazon PA API をコールする
 * 
 * @param {*} req リクエスト
 * @param {*} res レスポンス
 */
module.exports = async (req, res) => {
  try {
    if(`${req.method}`.toUpperCase() !== 'POST') {
      console.warn('apa-search : Not POST Method');
      return res.status(405).json({ error: 'Not POST Method' });
    }
    if(isInvalid(req.body)) {
      console.warn('apa-search : Invalid Parameter');
      return res.status(400).json({ error: 'Invalid Parameter' });
    }
    
    const commonParameters = {
      AccessKey  : req.body.accessKey,
      SecretKey  : req.body.secretKey,
      PartnerTag : req.body.partnerTag,
      PartnerType: 'Associates',
      Marketplace: 'www.amazon.co.jp'
    };
    const requestParameters = {
      Keywords   : req.body.keyword,
      SearchIndex: 'All',  // TODO : カテゴリを変更できるようにできたら良いな
      ItemCount  : 10,  // 10件が最大
      Resources  : [
        'ItemInfo.Title',
        'Images.Primary.Medium',
        'Offers.Listings.Price'
      ]
    };
    
    const data = await search(commonParameters, requestParameters);
    if(!getValue(data, 'SearchResult.Items')) {
      console.warn('apa-search : Results Not Found', data);
      return res.status(200).json({ error: 'Results Not Found' });
    }
    
    const results = data.SearchResult.Items.map((item, index) => ({
      id              : index,
      asin            : getValue(item, 'ASIN')                           || '',
      detailPageUrl   : getValue(item, 'DetailPageURL')                  || '',
      title           : getValue(item, 'ItemInfo.Title.DisplayValue')    || '',
      imageUrl        : getValue(item, 'Images.Primary.Medium.URL')      || '',
      imageWidth      : getValue(item, 'Images.Primary.Medium.Width')    || '',
      imageHeight     : getValue(item, 'Images.Primary.Medium.Height')   || '',
      price           : getValue(item, 'Offers.Listings.0.Price.Amount') || ''
    }));
    console.log('apa-search : Success', results);
    return res.status(200).json(results);
  }
  catch(error) {
    console.warn('apa-search : Error', error);
    return res.status(500).json({ error: 'Error', details: error});
  }
};
