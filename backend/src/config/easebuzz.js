import crypto from 'crypto';

export const getEasebuzzCredentials = () => {
  const key = process.env.EASEBUZZ_KEY;
  const salt = process.env.EASEBUZZ_SALT;
  const env = process.env.EASEBUZZ_ENV || 'test'; // 'test' or 'prod'

  if (!key || !salt) {
    throw new Error('Easebuzz credentials (EASEBUZZ_KEY, EASEBUZZ_SALT) are not configured.');
  }

  return { key, salt, env };
};

export const generateEasebuzzHash = (params, salt) => {
  const hashString = `${params.key}|${params.txnid}|${params.amount}|${params.productinfo}|${params.firstname}|${params.email}|${params.udf1 || ''}|${params.udf2 || ''}|${params.udf3 || ''}|${params.udf4 || ''}|${params.udf5 || ''}|${params.udf6 || ''}|${params.udf7 || ''}|${params.udf8 || ''}|${params.udf9 || ''}|${params.udf10 || ''}|${salt}`;
  return crypto.createHash('sha512').update(hashString).digest('hex');
};

export const verifyEasebuzzResponseHash = (params, salt) => {
  const {
    status,
    udf10 = '',
    udf9 = '',
    udf8 = '',
    udf7 = '',
    udf6 = '',
    udf5 = '',
    udf4 = '',
    udf3 = '',
    udf2 = '',
    udf1 = '',
    email,
    firstname,
    productinfo,
    amount,
    txnid,
    key
  } = params;

  const hashString = `${salt}|${status}|${udf10}|${udf9}|${udf8}|${udf7}|${udf6}|${udf5}|${udf4}|${udf3}|${udf2}|${udf1}|${email}|${firstname}|${productinfo}|${amount}|${txnid}|${key}`;
  const calculatedHash = crypto.createHash('sha512').update(hashString).digest('hex');
  return calculatedHash === params.hash;
};
