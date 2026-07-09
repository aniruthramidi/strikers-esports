import { createClient } from '@vercel/kv';

const kv = createClient({
  url: process.env.STORAGE_KV_REST_API_URL || process.env.KV_REST_API_URL,
  token: process.env.STORAGE_KV_REST_API_TOKEN || process.env.KV_REST_API_TOKEN,
});

export default async function handler(req, res) {
  try {
    const data = await kv.get('strikers_esports_data');
    return res.status(200).json(data || {});
  } catch (error) {
    console.error('KV GET error:', error);
    return res.status(500).json({ error: error.message });
  }
}
