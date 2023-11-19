module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ["plugin:vue/essential", "@vue/airbnb", "@vue/typescript/recommended", "prettier"],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    quotes: ["warn", "double", { avoidEscape: true }],
    "comma-dangle": "off",
    "no-plusplus": "off",
    "import/prefer-default-export": "off",
    "vuejs-accessibility/label-has-for": "off",
    "vuejs-accessibility/click-events-have-key-events": "off",
    "no-shadow": "off",
    "@typescript-eslint/no-shadow": ["error"]
  }
};
