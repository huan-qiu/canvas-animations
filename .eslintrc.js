module.exports = {
  root: true,
  env: {
    es2020: true
  },
  parserOptions: {
    sourceType: 'module'
  },
  extends: 'eslint:recommended',
  globals: {
    window: 'readonly',
    document: 'readonly',
    requestAnimationFrame: 'readonly',
    cancelAnimationFrame: 'readonly',
    Image: 'readonly'
  }
};
