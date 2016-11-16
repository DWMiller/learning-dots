module.exports = {
    "extends": "airbnb",
    "plugins": [
        "react",
        "jsx-a11y",
        "import"
    ],
    "env": {
        "browser": true,
        "node": true
    },
    "rules": {
      "no-console": 0,
      "no-underscore-dangle": 0,
      "no-use-before-define": ["error", { "functions": false }],
      "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
    }
};
