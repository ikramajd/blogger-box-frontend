const target = 'http://localhost:8080';

module.exports = {
  '/v1': {
    target,
    secure: false,
    changeOrigin: true
  }
};
