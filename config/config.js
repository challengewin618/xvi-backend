process.env.PORT = process.env.PORT || 3020;
process.env.NODE_ENV = process.env.NODE_ENV || 'pro';
let connection;

if (process.env.NODE_ENV === 'dev') {
  connection = 'mongodb://127.0.0.1:27017/leverage_pro';
} else {
  connection = 'mongodb://leverage:leverage@185.158.114.248:27017/leverage_pro';
}

process.env.CONNECTION = connection;
