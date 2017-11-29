module.exports = {
	env: {
		browser: true,
		es6: true,
		node: true
	},

	extends: [
		"eslint:recommended",
		"plugin:react/recommended",
		"plugin:jsx-a11y/recommended"
	],
	parser: "babel-eslint",
	parserOptions: {
		ecmaVersion: 2017,
		ecmaFeatures: {
			experimentalObjectRestSpread: true,
			jsx: true
		},
		sourceType: "module"
	},

	plugins: ["react", "jsx-a11y", "import"],

	rules: {
		indent: ["error", "tab"],
		"linebreak-style": 0,
		quotes: ["error", "double"],
		semi: ["error", "always"],
		"no-console": 0
	}
};
