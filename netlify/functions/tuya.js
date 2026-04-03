const crypto = require('crypto');

const ACCESS_ID = process.env.TUYA_ACCESS_ID || '4q8qscntk8jyhr3sn3jg';
const ACCESS_SECRET = process.env.TUYA_ACCESS_SECRET || '34c78188b3974274a950bebe4a5fe8b0';
const DEVICE_ID = process.env.TUYA_DEVICE_ID || 'ebe1364ffca9b13618gljh';
const API_HOST = 'https://openapi.tuyaus.com';

function sha256(str) {
  return crypto.createHash('sha256').update(str, 'utf8').digest('hex');
}

function hmacSha256(str, secret) {
  return crypto.createHmac('sha256', secret).update(str, 'utf8').digest('hex').toUpperCase();
}

function buildSign(accessId, secret, timestamp, nonce, accessToken, method, path, body = '') {
  const contentHash = sha256(body);
  const stringToSign = [method.toUpperCase(), contentHash, '', path].join('\n');
  const signStr = accessToken
    ? accessId + accessToken + timestamp + nonce + stringToSign
    : accessId + timestamp + nonce + stringToSign;
  return hmacSha256(signStr, secret);
}

async function getToken() {
  const timestamp = Date.now().toString();
  const nonce = crypto.randomUUID().replace(/-/g, '');
  const path = '/v1.0/token?grant_type=1';
  const sign = buildSign(ACCESS_ID, ACCESS_SECRET, timestamp, nonce, '', 'GET', path);

  const resp = await fetch(`${API_HOST}${path}`, {
    headers: {
      client_id: ACCESS_ID,
      sign,
      t: timestamp,
      nonce,
      sign_method: 'HMAC-SHA256',
    },
  });
  const data = await resp.json();
  if (!data.success) throw new Error(`Token error: ${data.msg}`);
  return data.result.access_token;
}

async function tuyaGet(path, token) {
  const timestamp = Date.now().toString();
  const nonce = crypto.randomUUID().replace(/-/g, '');
  const sign = buildSign(ACCESS_ID, ACCESS_SECRET, timestamp, nonce, token, 'GET', path);

  const resp = await fetch(`${API_HOST}${path}`, {
    headers: {
      client_id: ACCESS_ID,
      access_token: token,
      sign,
      t: timestamp,
      nonce,
      sign_method: 'HMAC-SHA256',
    },
  });
  return resp.json();
}

async function tuyaPost(path, body, token) {
  const timestamp = Date.now().toString();
  const nonce = crypto.randomUUID().replace(/-/g, '');
  const bodyStr = JSON.stringify(body);
  const sign = buildSign(ACCESS_ID, ACCESS_SECRET, timestamp, nonce, token, 'POST', path, bodyStr);

  const resp = await fetch(`${API_HOST}${path}`, {
    method: 'POST',
    headers: {
      client_id: ACCESS_ID,
      access_token: token,
      sign,
      t: timestamp,
      nonce,
      sign_method: 'HMAC-SHA256',
      'Content-Type': 'application/json',
    },
    body: bodyStr,
  });
  return resp.json();
}

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  const action = event.queryStringParameters?.action || 'status';

  try {
    const token = await getToken();

    if (action === 'status') {
      const data = await tuyaGet(`/v1.0/devices/${DEVICE_ID}/status`, token);
      return { statusCode: 200, headers, body: JSON.stringify(data) };
    }

    if (action === 'switch') {
      const body = event.body ? JSON.parse(event.body) : {};
      const value = body.value ?? true;
      const data = await tuyaPost(`/v1.0/devices/${DEVICE_ID}/commands`, {
        commands: [{ code: 'switch_1', value }],
      }, token);
      return { statusCode: 200, headers, body: JSON.stringify(data) };
    }

    if (action === 'logs') {
      const type = event.queryStringParameters?.type || 'cur_power';
      const startTime = event.queryStringParameters?.start || (Date.now() - 3600000).toString();
      const endTime = event.queryStringParameters?.end || Date.now().toString();
      const data = await tuyaGet(
        `/v1.0/devices/${DEVICE_ID}/logs?type=7&codes=${type}&start_row_key=&start_time=${startTime}&end_time=${endTime}&size=50`,
        token
      );
      return { statusCode: 200, headers, body: JSON.stringify(data) };
    }

    if (action === 'info') {
      const data = await tuyaGet(`/v1.0/devices/${DEVICE_ID}`, token);
      return { statusCode: 200, headers, body: JSON.stringify(data) };
    }

    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Unknown action' }) };
  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
