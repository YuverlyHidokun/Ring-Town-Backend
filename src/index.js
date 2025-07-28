import dotenv from 'dotenv';

dotenv.config();

import app from './server.js';
import connection from './database.js';

connection();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Server ok on http://localhost:${PORT}`);
});
