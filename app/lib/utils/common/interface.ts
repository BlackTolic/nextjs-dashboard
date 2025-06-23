// 将返回的汉字转换成英文字段
export const transMapProps = async (columnMap, dataSource) => {
  //   return Object.keys(columnMap).reduce((acc, key) => {
  //     acc[columnMap[key]] = item[key];
  //     return acc;
  //   });
  return dataSource.map(item => {
    const newItem = {}; // 创建一个新的对象，用于存储转换后的数据
    for (const key in columnMap) {
      // 遍历 columnMap 对象的键值对
      newItem[columnMap[key]] = item[key]; // 将原对象的键值对转换为新对象的键值对
    } // 返回新对象
    return newItem;
  });
};

// 将对象的键名从下划线格式转换为驼峰格式
export const snakeToCamelObj = (obj: Record<string, string>) => {
  const result: Record<string, string> = {}; // 创建一个新对象，用于存储转换后的数据
  for (const key in obj) {
    // 遍历原对象的键值对
    const camelKey = key.replace(/_([a-z])/g, (match, p1) => p1.toUpperCase()); // 将下划线格式的键名转换为驼峰格式的键名
    result[camelKey] = obj[key]; // 将转换后的数据存储到新对象中
  } // 返回新对象
  return result;
};
