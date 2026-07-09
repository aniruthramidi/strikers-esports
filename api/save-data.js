import { createClient } from '@vercel/kv';

const kv = createClient({
  url: process.env.STORAGE_KV_REST_API_URL || process.env.KV_REST_API_URL,
  token: process.env.STORAGE_KV_REST_API_TOKEN || process.env.KV_REST_API_TOKEN,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const data = req.body;
    await kv.set('strikers_esports_data', data);
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('KV SET error:', error);
    return res.status(500).json({ error: error.message });
  }
}
