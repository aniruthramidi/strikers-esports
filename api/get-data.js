import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  try {
    const data = await kv.get('strikers_esports_data');
    return res.status(200).json(data || {});
  } catch (error) {
    console.error('KV GET error:', error);
    return res.status(500).json({ error: error.message });
  }
}
