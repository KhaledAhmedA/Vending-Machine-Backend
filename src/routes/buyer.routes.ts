import { Router } from 'express';
import {
    deposit,
    buyProduct,
    resetDeposit,
    getDeposit,
} from '../controllers/buyer.controller';
import { authenticate, authorizeRoles } from '../middleware/auth.middleware';

const router = Router();

router.post('/deposit', authenticate, authorizeRoles('buyer'), deposit as any);
router.post('/buy', authenticate, authorizeRoles('buyer'), buyProduct as any);
router.post('/reset', authenticate, authorizeRoles('buyer'), resetDeposit);
router.get('/deposit', authenticate, authorizeRoles('buyer'), getDeposit as any);

export default router;
