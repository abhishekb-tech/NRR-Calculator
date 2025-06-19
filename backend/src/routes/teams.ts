import { Router } from 'express';
import { teams } from '../utils/teams';

const router = Router();

router.get('/', async (req, res, next) => {
    try {
        res.json({
            status: true,
            error: null,
            data: teams
        });
    } catch (error) {
        next(error);
    }
});

export default router; 