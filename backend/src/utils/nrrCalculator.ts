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
    const targetPosition = teams.sort((a, b) => b.nrr - a.nrr)[input.desiredPosition - 1];
    const targetNRR = targetPosition.nrr;

    if (input.isBattingFirst) {
        // Calculate runs to restrict opponent to
        const currentRunRate = (yourTeam.runsFor + input.runsScored) / (oversToDecimals(yourTeam.oversFor) + input.overs);
        let minRuns = Math.floor(input.overs * (currentRunRate - targetNRR - 0.001));
        let maxRuns = Math.ceil(input.overs * (currentRunRate - targetNRR + 0.001));

        // Ensure restricted runs are not more than scored runs
        maxRuns = Math.min(maxRuns, input.runsScored - 1);
        minRuns = Math.min(minRuns, maxRuns);

        return {
            scenario: "Bowling Second",
            minRuns,
            maxRuns,
            revisedNrrMin: calculateNRR(
                yourTeam.runsFor + input.runsScored,
                yourTeam.oversFor + input.overs,
                yourTeam.runsAgainst + minRuns,
                yourTeam.oversAgainst + input.overs
            ),
            revisedNrrMax: calculateNRR(
                yourTeam.runsFor + input.runsScored,
                yourTeam.oversFor + input.overs,
                yourTeam.runsAgainst + maxRuns,
                yourTeam.oversAgainst + input.overs
            )
        };
    } else {
        // Calculate overs needed to chase target
        const targetRunRate = targetNRR + (yourTeam.runsAgainst / oversToDecimals(yourTeam.oversAgainst));
        let minOvers = Math.max(1, Math.floor((input.runsScored / targetRunRate) * 10) / 10);
        let maxOvers = Math.min(input.overs, Math.ceil((input.runsScored / (targetRunRate - 0.001)) * 10) / 10);

        // Ensure overs don't exceed input overs
        maxOvers = Math.min(maxOvers, input.overs);
        minOvers = Math.min(minOvers, maxOvers);

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