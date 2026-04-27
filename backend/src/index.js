import { createApp } from './app.js';
import { config } from './config.js';

const app = createApp();

if (process.env.NODE_ENV !== 'production') {
  app.listen(config.port, () => {
    console.log(`API em http://localhost:${config.port}/api/v1`);
  });
}

export default app;
