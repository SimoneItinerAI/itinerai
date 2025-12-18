import { Router } from 'express';
import authRouter from './auth.routes.js';
import itinerariesRouter from './itineraries.routes.js';
import preferencesRouter from './preferences.routes.js';
import searchRouter from './search.routes.js';

export const router = Router();
router.use('/auth', authRouter);
router.use('/itineraries', itinerariesRouter);
router.use('/preferences', preferencesRouter);
router.use('/search', searchRouter);
