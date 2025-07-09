import { Router } from 'express';
import authRoutes from './auth.routes';
import productRoutes from './product.routes';
import buyerRoutes from './buyer.routes';
import userRoutes from './user.routes';



const router = Router();

router.use('/users', authRoutes);
router.use('/account', userRoutes); // /me (GET, PUT, DELETE)

router.use('/products', productRoutes);
router.use('/', buyerRoutes); // /deposit, /buy, /reset


export default router;
