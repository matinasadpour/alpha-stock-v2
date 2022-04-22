const WooCommerceRestApi = require('@woocommerce/woocommerce-rest-api').default;
const fs = require('fs');

const api = new WooCommerceRestApi({
  url: 'https://www.alpha-stock.com/',
  consumerKey: 'ck_26ccbb0e20a8ad26a023fe56a9331312ac86149c',
  consumerSecret: 'cs_35c1b82c8bb01feb21d4783c934daded875ad23d',
  version: 'wc/v3',
  queryStringAuth: true,
});

window.api = api;
window.log = (log) => {
  fs.appendFileSync(
    './alpha-stock/error',
    `[${new Date().toLocaleString()}] ${log.toString()}\n`
  );
};
