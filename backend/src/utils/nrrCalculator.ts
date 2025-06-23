import { CalculationInput, CalculationResult } from '../types';
import { teams } from './teams';

// Converts cricket overs (e.g. 4.3) to decimal overs (4.5)
export function oversToDecimals(overs: number): number {
    const fullOvers = Math.floor(overs);
    const balls = (overs - fullOvers) * 10;  // Convert to balls
    return fullOvers + (balls / 6);  // 6 balls = 1 over
}

// Calculates Net Run Rate (NRR) = (Runs per over scored) - (Runs per over conceded)
export function calculateNRR(runsFor: number, oversFor: number, runsAgainst: number, oversAgainst: number): number {
    const rateFor = runsFor / oversToDecimals(oversFor);
    const rateAgainst = runsAgainst / oversToDecimals(oversAgainst);
    return rateFor - rateAgainst;
}

// Calculates scenarios to achieve target NRR position
export function calculateScenario(input: CalculationInput): CalculationResult {
    // Get team stats and target NRR
    const yourTeam = teams.find(t => t.name === input.yourTeam)!;
    const sortedTeams = teams.sort((a, b) => b.nrr - a.nrr);
    const targetPosition = sortedTeams[input.desiredPosition - 1];
    const nextPosition = sortedTeams[input.desiredPosition];
    
    // Calculate target NRR range with a wider margin
    const targetNRRMax = targetPosition.nrr + 0.15; // Increased margin for upper bound
    const targetNRRMin = nextPosition ? nextPosition.nrr + 0.05 : targetPosition.nrr - 0.15; // Increased margin for lower bound

    if (input.isBattingFirst) {
        // Calculate runs to restrict opponent to
        const currentRunRate = (yourTeam.runsFor + input.runsScored) / (oversToDecimals(yourTeam.oversFor) + input.overs);
        
        // Calculate range based on target NRR range with wider margins
        let maxRuns = Math.floor(input.overs * (currentRunRate - targetNRRMin));
        let minRuns = Math.ceil(input.overs * (currentRunRate - targetNRRMax));

        // Add a reasonable margin for the runs range (±5 runs)
        maxRuns = Math.min(maxRuns + 5, input.runsScored - 1);
        minRuns = Math.max(0, Math.min(minRuns - 5, maxRuns - 10));

        return {
            scenario: "Bowling Second",
            minRuns,
            maxRuns,
            revisedNrrMin: calculateNRR(
                yourTeam.runsFor + input.runsScored,
                yourTeam.oversFor + input.overs,
                yourTeam.runsAgainst + maxRuns,
                yourTeam.oversAgainst + input.overs
            ),
            revisedNrrMax: calculateNRR(
                yourTeam.runsFor + input.runsScored,
                yourTeam.oversFor + input.overs,
                yourTeam.runsAgainst + minRuns,
                yourTeam.oversAgainst + input.overs
            )
        };
    } else {
        // Calculate overs needed to chase target with wider margins
        const targetRunRateMin = targetNRRMin + (yourTeam.runsAgainst / oversToDecimals(yourTeam.oversAgainst));
        const targetRunRateMax = targetNRRMax + (yourTeam.runsAgainst / oversToDecimals(yourTeam.oversAgainst));
        
        // Calculate range of overs needed with validation
        let minOvers = Math.max(1, Math.floor((input.runsScored / targetRunRateMax) * 10) / 10);
        let maxOvers = Math.min(input.overs, Math.ceil((input.runsScored / targetRunRateMin) * 10) / 10);

        // Validate and adjust overs
        if (minOvers > input.overs) {
            // If minimum overs needed exceeds available overs, target is impossible
            minOvers = input.overs - 1;
            maxOvers = input.overs;
        } else {
            // Ensure at least 1 over difference and within match overs
            minOvers = Math.min(minOvers, input.overs - 1);
            maxOvers = Math.min(maxOvers, input.overs);
            
            if (maxOvers - minOvers < 1) {
                maxOvers = Math.min(input.overs, minOvers + 1);
            }
        }

        return {
            scenario: "Batting Second",
            minOvers,
            maxOvers,
            revisedNrrMin: calculateNRR(
                yourTeam.runsFor + input.runsScored,
                yourTeam.oversFor + maxOvers,
                yourTeam.runsAgainst,
                yourTeam.oversAgainst
            ),
            revisedNrrMax: calculateNRR(
                yourTeam.runsFor + input.runsScored,
                yourTeam.oversFor + minOvers,
                yourTeam.runsAgainst,
                yourTeam.oversAgainst
            )
        };
    }
} 