import { Router } from 'express';
import {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct,
} from '../controllers/product.controller';
import { authenticate, authorizeRoles } from '../middleware/auth.middleware';

const router = Router();

router.get('/', getProducts);
router.post('/', authenticate, authorizeRoles('seller'), createProduct);
router.put('/:id', authenticate, authorizeRoles('seller'), updateProduct);
router.delete('/:id', authenticate, authorizeRoles('seller'), deleteProduct);

export default router;
