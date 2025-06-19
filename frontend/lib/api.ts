import { CalculationInput, CalculationResult, Team, TeamsResponse, CalculatorResponse } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const getTeams = async (): Promise<TeamsResponse> => {
    const response = await fetch(`${API_URL}/api/teams`);
    if (!response.ok) {
        throw new Error('Failed to fetch teams');
    }
    return response.json();
};

export const calculateScenario = async (input: CalculationInput): Promise<CalculatorResponse> => {
    const response = await fetch(`${API_URL}/api/calculate`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
    });
    
    if (!response.ok) {
        throw new Error('Failed to calculate scenario');
    }
    
    return response.json();
}; 