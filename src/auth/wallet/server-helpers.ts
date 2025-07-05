'use server';
import crypto from 'crypto';

/**
 * Generates an HMAC-SHA256 hash of the provided nonce using a secret key from the environment.
 * @param {Object} params - The parameters object.
 * @param {string} params.nonce - The nonce to be hashed.
 * @returns {string} The resulting HMAC hash in hexadecimal format.
 */
const hashNonce = ({ nonce }: { nonce: string }) => {
  const hmac = crypto.createHmac('sha256', process.env.HMAC_SECRET_KEY!);
  hmac.update(nonce);
  return hmac.digest('hex');
};

/**
 * Generates a new random nonce and its corresponding HMAC signature.
 * @async
 * @returns {Promise<{ nonce: string, signedNonce: string }>} An object containing the nonce and its signed (hashed) value.
 */
export const getNewNonces = async () => {
  const nonce = crypto.randomUUID().replace(/-/g, '');
  const signedNonce = hashNonce({ nonce });
  return {
    nonce,
    signedNonce,
  };
};
