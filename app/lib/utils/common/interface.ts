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
