module.exports = {
  "env": {
    "browser": true,
    "es2021": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "overrides": [
    // apply these to test files only
    {
      "files": ["src/__tests__/**"],
      "plugins": ["jest"],
      "extends": ["plugin:jest/recommended"],
      "rules": { 
        "jest/prefer-expect-assertions": "error",
        "jest/prefer-to-have-length": "error",
        "jest/prefer-lowercase-title": "error" 
      }
    }
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "plugins": [
    "@typescript-eslint"
  ],
  "rules": {
    "indent": ["error", 2],
    "no-multiple-empty-lines": ["error", {max: 1}],
    "no-unused-vars": "error"
  },
  "ignorePatterns": ["dist", "node_modules", "coverage", "output"]
}
