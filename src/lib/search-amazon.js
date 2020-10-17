/**
 * Amazon 検索 API をコールする
 * 
 * @param {*} params リクエストボディ
 * @return {Promise<*>} 検索結果
 * @throws API コールに失敗した場合
 */
export default async function searchAmazon(params) {
  try {
    const response = await fetch('/api/apa-search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        accessKey : params.amazonAccessKey,
        secretKey : params.amazonSecretKey,
        partnerTag: params.amazonPartnerTag,
        keyword   : params.keyword
      })
    });
    const data = await response.json();
    
    if(data.error) {
      console.warn('searchAmazon : Error', data);
      throw data;
    }
    
    return data;
  }
  catch(error) {
    console.warn('searchAmazon : Catch Error', error);
    throw error;
  }
}
