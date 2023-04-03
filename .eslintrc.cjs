module.exports = {
  globals: {
    React: "readonly",
    JSX: "readonly",
  },
  parser: "@typescript-eslint/parser",
  extends: [
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
  ], //使用推荐的React代码检测规范
  plugins: ["@typescript-eslint"],
  env: {
    browser: true,
    node: true,
  },
  settings: {
    //自动发现React的版本，从而进行规范react代码
    react: {
      pragma: "React",
      // version: 'detect',
      version: "999.999.999",
    },
  },
  parserOptions: {
    //指定ESLint可以解析JSX语法
    ecmaVersion: 2020,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-var-requires": 0,
    "react/react-in-jsx-scope": 0,
    "@typescript-eslint/explicit-function-return-type": 0,
    "@typescript-eslint/no-empty-function": 0,
    "@typescript-eslint/no-explicit-any": 0,
    "@typescript-eslint/no-unused-vars": 0,
    "@typescript-eslint/no-use-before-define": 0,
    "@typescript-eslint/class-name-casing": 0,
    "@typescript-eslint/triple-slash-reference": 0,
    "react-hooks/rules-of-hooks": "warn",
    "react-hooks/exhaustive-deps": "off",
    "prettier/prettier": [
      "error",
      {
        printWidth: 120,
        semi: true,
        singleQuote: true,
        trailingComma: "all",
        bracketSpacing: false,
        jsxBracketSameLine: true,
        arrowParens: "avoid",
        insertPragma: false,
        tabWidth: 2,
        useTabs: false,
        endOfLine: "auto",
      },
    ],
  },
};
