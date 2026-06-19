const { getAnalytics } = require('./src/modules/analytics/analytics.controller.js');
const req = {};
const res = {
  json: (data) => console.log('SUCCESS:', data),
  status: (code) => {
    console.log('STATUS:', code);
    return { json: (data) => console.log('ERROR:', data) };
  }
};
getAnalytics(req, res).catch(console.error);
