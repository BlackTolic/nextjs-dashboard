/**
 * ESLint 配置文件
 * @description 用于配置代码规范和格式化规则
 * @see https://eslint.org/docs/user-guide/configuring
 */

module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react', /* 'react-hooks', */ 'prettier' /* 'import' */], // 使用 Prettier 推荐的规则
  extends: [
    'eslint:recommended', // 使用 ESLint 推荐的规则
    'plugin:@typescript-eslint/recommended', // 使用 TypeScript ESLint 推荐的规则
    'plugin:react/recommended', // 使用 React ESLint 推荐的规则
    // 'plugin:react-hooks/recommended', // 使用 React Hooks ESLint 推荐的规则
    'plugin:prettier/recommended' // 使用 Prettier 推荐的规则
    // 'next/core-web-vitals' // 使用 Next.js 推荐的规则
  ],
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  settings: {
    react: {
      version: 'detect'
    }
  },
  rules: {
    'prettier/prettier': 'warn', // 使用 Prettier 推荐的规则
    'react/react-in-jsx-scope': 'off', // 关闭 React 在 JSX 中的导入警告
    '@typescript-eslint/explicit-module-boundary-types': 'off', // 关闭 TypeScript 显式模块边界类型警告
    '@typescript-eslint/no-explicit-any': 'warn', // 关闭 TypeScript 禁止使用 any 类型警告
    '@typescript-eslint/no-unused-vars': 'off', // 关闭未使用变量的警告
    'react/prop-types': 'off', // 关闭 React 组件属性类型检查
    '@typescript-eslint/no-var-requires': 'off' // 关闭 TypeScript 禁止使用 require 警告
    // 'import/order': [
    //   'error',
    //   {
    //     groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'], // 导入顺序
    //     'newlines-between': 'always', // 导入顺序
    //     alphabetize: {
    //       order: 'asc',
    //       caseInsensitive: true
    //     }
    //   }
    // ]
  }
};
