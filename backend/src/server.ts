import { app } from './app.js';
import { env } from './utils/env.js';

const port = env.PORT || 4000;
app.listen(port, () => {});
