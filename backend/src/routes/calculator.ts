import { Router } from 'express';
import { calculateScenario } from '../utils/nrrCalculator';
import { CalculationInput } from '../types';

const router = Router();

router.post('/', async (req, res, next) => {
    try {
        const input: CalculationInput = req.body;
        const result = calculateScenario(input);
        res.json({
            status: true,
            error: null,
            data: result
        });
    } catch (error) {
        next(error);
    }
});

export default router; 