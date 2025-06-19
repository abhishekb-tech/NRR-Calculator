export interface Team {
    name: string;
    matches: number;
    won: number;
    lost: number;
    nrr: number;
    runsFor: number;
    oversFor: number;
    runsAgainst: number;
    oversAgainst: number;
    points: number;
}

export interface CalculationInput {
    yourTeam: string;
    oppositionTeam: string;
    overs: number;
    desiredPosition: number;
    isBattingFirst: boolean;
    runsScored: number;
}

export interface CalculationResult {
    scenario: string;
    requiredRuns?: number;
    requiredOvers?: number;
    minRuns?: number;
    maxRuns?: number;
    minOvers?: number;
    maxOvers?: number;
    revisedNrrMin: number;
    revisedNrrMax: number;
} 