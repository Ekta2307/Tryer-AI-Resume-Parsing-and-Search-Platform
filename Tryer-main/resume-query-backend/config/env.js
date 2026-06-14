require('dotenv').config();

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 5000),
  mongoUri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/tryer',
  clientUrl: process.env.CLIENT_URL || '*',
  uploadLimitMb: Number(process.env.UPLOAD_LIMIT_MB || 5),
};

module.exports = { env };
