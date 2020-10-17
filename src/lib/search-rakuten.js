import getValue from './get-value';

/**
 * 楽天市場検索 API をコールする
 * 
 * @param {*} params リクエストボディ
 * @return {Promise<*>} 検索結果
 * @throws API コールに失敗した場合
 */
export default async function searchRakuten(params) {
  try {
    const applicationId = params.rakutenApplicationId;
    const affiliateId   = params.rakutenAffiliateId;
    const keyword       = params.keyword;
    const encodedKeyword = encodeURIComponent(keyword);
    
    const response = await fetch(`https://app.rakuten.co.jp/services/api/IchibaItem/Search/20170706?format=json&keyword=${encodedKeyword}&applicationId=${applicationId}&affiliateId=${affiliateId}`);
    const data = await response.json();
    
    if(!data.Items || data.error) {
      console.warn('searchRakuten : Error', data);
      throw data;
    }
    if(!data.Items.length) {
      console.warn('searchRakuten : No Results', data);
      throw new Error('Results Not Found');
    }
    
    const results = data.Items.map((item, index) => ({
      id       : index,
      itemName : getValue(item, 'Item.itemName'),
      itemUrl  : getValue(item, 'Item.affiliateUrl'),  // itemUrl は同じ値
      imageUrl : getValue(item, 'Item.mediumImageUrls.0.imageUrl'),
      shopName : getValue(item, 'Item.shopName'),
      shopUrl  : getValue(item, 'Item.shopAffiliateUrl'),  // shopUrl は同じ値
      itemPrice: getValue(item, 'Item.itemPrice')
    }));
    return results;
  }
  catch(error) {
    console.warn('searchRakuten : Catch Error', error);
    throw error;
  }
}
