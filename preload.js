const WooCommerceRestApi = require('@woocommerce/woocommerce-rest-api').default;
const fs = require('fs');
const qz = require('qz-tray');
const { KEYUTIL, KJUR, stob64, hextorstr } = require('jsrsasign');

const api = new WooCommerceRestApi({
  url: 'https://www.alpha-stock.com/',
  consumerKey: 'ck_26ccbb0e20a8ad26a023fe56a9331312ac86149c',
  consumerSecret: 'cs_35c1b82c8bb01feb21d4783c934daded875ad23d',
  version: 'wc/v3',
  queryStringAuth: true,
});

qz.security.setCertificatePromise(function (resolve, reject) {
  resolve(`-----BEGIN CERTIFICATE-----
  MIIEBzCCAu+gAwIBAgIUAWG56RT/egspMveUq3IKdSbHsu8wDQYJKoZIhvcNAQEL
  BQAwgZExCzAJBgNVBAYTAklSMQswCQYDVQQIDAJXQTERMA8GA1UEBwwIU2FyZGFz
  aHQxFDASBgNVBAoMC0FscGhhIFN0b2NrMQswCQYDVQQLDAJBUzEaMBgGA1UEAwwR
  Ki5hbHBoYS1zdG9jay5jb20xIzAhBgkqhkiG9w0BCQEWFGluZm9AYWxwaGEtc3Rv
  Y2suY29tMCAXDTIyMDQyODIzMjAwMVoYDzIwNTMxMDIxMjMyMDAxWjCBkTELMAkG
  A1UEBhMCSVIxCzAJBgNVBAgMAldBMREwDwYDVQQHDAhTYXJkYXNodDEUMBIGA1UE
  CgwLQWxwaGEgU3RvY2sxCzAJBgNVBAsMAkFTMRowGAYDVQQDDBEqLmFscGhhLXN0
  b2NrLmNvbTEjMCEGCSqGSIb3DQEJARYUaW5mb0BhbHBoYS1zdG9jay5jb20wggEi
  MA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCxLWFqyt9MjjSoYu8l+6moXAKm
  Rhwo69DA1uZId9LHryB4ZCNYvtAwCCgsX596ByHfIGLCZmu9be3f4mRhuEmMFzC9
  IyISKZths1FdbLmqreVs06lpU7eibtRCFzpvrPGbrHIiQMdjo+KLAkqcYhLZb1i+
  CCMvwzKXogSIhXHVTQ/MoVI4RNuf7KM71ZYUEn6SaMFDw7uPcPJaPVor7iA/1q1P
  MTF7/VEp3KDrSn7KrYZ8egaPpS6SPJ3NESWNJ2XOkM1Bfks9HmG06yBk8ExJ7zES
  Mtuo1BDY6yX96rHlwPLjZ2eo4dBjR1WFf86vbw/C7LikghQLvkHPFky1BlgfAgMB
  AAGjUzBRMB0GA1UdDgQWBBRQgW/bS7bm+dLMSnTLS7+pxbsRFzAfBgNVHSMEGDAW
  gBRQgW/bS7bm+dLMSnTLS7+pxbsRFzAPBgNVHRMBAf8EBTADAQH/MA0GCSqGSIb3
  DQEBCwUAA4IBAQBwjmOPJiOJ9HRbpzSAsABk3tP0ORS17xEGMBEZN1r3NqN0F1NC
  v/6f6WJDAFjqySgtyOzrxOXBzKDoqkvMWimKcn+YKp8r4xoTWlZzGXMEC6+1ZuQt
  KU1vyQh2+Q9X044R8Jga5DdVDyqqYOcibLqDPRCvDylbRS4iGCMcZj6l+O/gRItK
  jySH5M20YOIHrBRPzKNh/LqM/muizVXthCNbVjxn9RcaMAqk5ZfCu4IZDfVHESZb
  5rP3MKnXBelyzo2W7CRIVFx0fVB4EAv0AnJpMbk+8H8X1b/e3jrTgg6l+8my2z1G
  jbN2dJCotVGqUwqlRVl0vAw8m2YdF17m7pGq
  -----END CERTIFICATE-----
  `);
});

const privateKey = `-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCxLWFqyt9MjjSo
Yu8l+6moXAKmRhwo69DA1uZId9LHryB4ZCNYvtAwCCgsX596ByHfIGLCZmu9be3f
4mRhuEmMFzC9IyISKZths1FdbLmqreVs06lpU7eibtRCFzpvrPGbrHIiQMdjo+KL
AkqcYhLZb1i+CCMvwzKXogSIhXHVTQ/MoVI4RNuf7KM71ZYUEn6SaMFDw7uPcPJa
PVor7iA/1q1PMTF7/VEp3KDrSn7KrYZ8egaPpS6SPJ3NESWNJ2XOkM1Bfks9HmG0
6yBk8ExJ7zESMtuo1BDY6yX96rHlwPLjZ2eo4dBjR1WFf86vbw/C7LikghQLvkHP
Fky1BlgfAgMBAAECggEAPk6OLqcPZfWwcPLx1PKulCVfTSfkqUNckyQ/sYZp2o0s
pwnYIFJiFjIYJpquE5TEhZn3ARRRmTk6aPxNfsv3GUviePEM/0Qgf3g3Cdq9ZFdp
Eh9ROVgWgQnmnSNcCn/QK4W2UXNkaxbsCSSSJnKa3Fo65AEqlpZXiVmRrIz5HiA4
V4/RGEgQpVCVM8G50WO2OQVmgV2qhZ5DatwpV13miGyfsKIg/1fT5dXBqH7Vovdg
kLG/9iv+N2syx6jOwGSOFFFGYHsbYpdCx4XXdIIpNLYqn7NjgjFnK4PTWMKOEtzM
1+FnGYCVcXLrg6IQ0oRupPS9MIetVg1jU4uFBbV7mQKBgQDlJyhz54RJW+92e891
pZ6Qa+AlSYQHg3QP9uDOAEohE0peuMvyom+5T/7QpkZsZEKd3bbV081IWGevYHTH
UH6HPzWD75euH8ojZsa+qjKhrf2c8nni17UKfe21MZjCXQX/sIvF99zFIvfNO2va
Hwkcbs6nq0pGnNMV8XkG8nnnFQKBgQDF71kSHu6ofOnf+xLOKpFNrhXk0x1IHBuH
ubTlb/60Izzw4TgebqSgwIiW6uSzwNWdYvz83IuHgXMoqehrEGzcMglb8G+pl4d6
sHX9lAYJWTRJtvRI8Q6R+wfC4LcHbu2r0urtW8Key39oOe6Vdtj91QpqQ/8qZZ0J
Cy4T5+jPYwKBgQCqbM4MLYJYINTelMQ9ZhigpmpEsQFNqTlXai/VZae8I6GrAttD
sAVRmCoWOaOkl4hn6m5BZ02EYaNzblRLrBT+N0dwwW9Yo/HtFFH5mZEgZ8t3v2ph
CDZwACobGTDYVODSQhYh/O6nexM7Atd6mJxpFgwB7UXHcHkZF8cAILQC5QKBgQCu
bcDWwT+cZ4hLBB2MZeLqy9EreAhD9dElCLirwMh6wtr/g9pKp0KZD1LPfGzTI8qc
ChHcXBbx8Vgkq6bQQwdL/SRWS0p777dKnZs9PmcbcessUvhwF065wrkSOanR+SWl
2BeD2OtnuPmsRfFE8hlDh6zH/Ogu2qFKyPlwPVzi9QKBgHW5MqHlJ1uyfUL3ft+z
bRrqeg8L6FEKJxeUZ5xeuNwB+mLRY3EA7lzIJzc46jfU6tmQmQuRcVS1Xknf+CGG
mwwLRfHCTGspi9fqF5Dy1yPn0mEUcdKxZkNe4hmtKWTA8wYsSVDI7fNJ2bZCuV0G
gIBQIP0Q3i7GC53lph0kAnj/
-----END PRIVATE KEY-----
`;

qz.security.setSignatureAlgorithm('SHA512'); // Since 2.1
qz.security.setSignaturePromise(function (toSign) {
  return function (resolve, reject) {
    try {
      var pk = KEYUTIL.getKey(privateKey);
      var sig = new KJUR.crypto.Signature({ alg: 'SHA512withRSA' }); // Use "SHA1withRSA" for QZ Tray 2.0 and older
      sig.init(pk);
      sig.updateString(toSign);
      var hex = sig.sign();
      console.log('DEBUG: \n\n' + stob64(hextorstr(hex)));
      resolve(stob64(hextorstr(hex)));
    } catch (err) {
      console.error(err);
      reject(err);
    }
  };
});

window.api = api;
window.qz = qz;
window.db = {
  save: (items, total) => {
    if (localStorage.getItem('lastOrder')) {
      localStorage.setItem('lastOrder', 1);
    } else {
      localStorage.setItem('lastOrder', +localStorage.getItem('lastOrder') + 1);
    }
    const obj = {
      items,
      total,
      date: new Date(),
      order: +localStorage['lastOrder'],
    };
    fs.appendFileSync('./alpha-stock/db', JSON.stringify(obj) + '\n');
    return obj;
  },
};
window.log = (log) => {
  fs.appendFileSync(
    './alpha-stock/error',
    `[${new Date().toLocaleString()}] ${log.toString()}\n`
  );
};
