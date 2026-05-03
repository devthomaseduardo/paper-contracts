import 'dotenv/config';

const parseOrigins = (raw) => {
  const defaults = ['http://localhost:3000', 'http://localhost:5173', 'http://127.0.0.1:5173'];
  if (!raw?.trim()) return defaults;
  const origins = raw.split(',').map((s) => s.trim()).filter(Boolean);
  return [...new Set([...defaults, ...origins])];
};

export const config = {
  port: Number(process.env.PORT) || 4000,
  geminiApiKey: process.env.GEMINI_API_KEY ?? '',
  frontendOrigins: parseOrigins(process.env.FRONTEND_ORIGIN),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  mercadoPagoAccessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN ?? '',
  mercadoPagoPublicKey: process.env.MERCADO_PAGO_PUBLIC_KEY ?? '',
};
