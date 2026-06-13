import Razorpay from 'razorpay';

export const getRazorpayCredentials = () => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error('Razorpay credentials are not configured.');
  }

  return { keyId, keySecret };
};

export const createRazorpayClient = () => {
  const { keyId, keySecret } = getRazorpayCredentials();

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret
  });
};

export const getRazorpayKeyId = () => process.env.RAZORPAY_KEY_ID || '';