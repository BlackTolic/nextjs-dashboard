'use server';

export async function tickerSearchByKeywords(keywords: string) {
  console.log(process.env.STOCK_API_KEY);
  const response = await fetch(
    'https://sapi.k780.com/?app=finance.stock_list&category=hs&appkey=10003&sign=b59bc3ef6191eb9f747dd4e83c99f2a4&format=json'
  );
  return await response.json();
}
