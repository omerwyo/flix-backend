import { Router } from 'express';
import CreditRouter from './Credits';
import TitleRouter from './Titles';

// Init router and path
const router = Router();

// Add sub-routes
router.use('/titles', TitleRouter);
router.use('/credits', CreditRouter);

// Export the base-router
export default router;