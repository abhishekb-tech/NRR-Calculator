import React from 'react';
import { CalculationResult } from '../../lib/types';

interface ResultProps {
  result: CalculationResult;
  formData: {
    yourTeam: string;
    oppositionTeam: string;
    overs: number;
    runsScored: number;
  };
  className?: string;
}

const Result: React.FC<ResultProps> = ({ result, formData, className = '' }) => {
  return (
    <div className={`bg-white p-6 rounded-lg shadow-lg ${className}`}>
      <h2 className="text-2xl font-bold mb-4">Result</h2>
      <div className="space-y-4">
        {result.scenario === "Bowling Second" ? (
          <>
            <div className="p-4 bg-gray-50 rounded-md">
              <p className="text-gray-800">
                If <span className="font-semibold">{formData.yourTeam}</span> scores{' '}
                <span className="font-semibold">{formData.runsScored}</span> runs in{' '}
                <span className="font-semibold">{formData.overs}</span> overs,
                they need to restrict <span className="font-semibold">{formData.oppositionTeam}</span> between{' '}
                <span className="font-semibold">{result.minRuns}</span> to{' '}
                <span className="font-semibold">{result.maxRuns}</span> runs in{' '}
                <span className="font-semibold">{formData.overs}</span> overs.
              </p>
            </div>
            <div className="p-4 bg-indigo-50 rounded-md">
              <p className="text-indigo-800">
                Revised NRR of <span className="font-semibold">{formData.yourTeam}</span> will be between{' '}
                <span className="font-semibold">{result.revisedNrrMin.toFixed(3)}</span> to{' '}
                <span className="font-semibold">{result.revisedNrrMax.toFixed(3)}</span>
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="p-4 bg-gray-50 rounded-md">
              <p className="text-gray-800">
                <span className="font-semibold">{formData.yourTeam}</span> needs to chase{' '}
                <span className="font-semibold">{formData.runsScored}</span> runs between{' '}
                <span className="font-semibold">{result.minOvers}</span> and{' '}
                <span className="font-semibold">{result.maxOvers}</span> overs.
              </p>
            </div>
            <div className="p-4 bg-indigo-50 rounded-md">
              <p className="text-indigo-800">
                Revised NRR for <span className="font-semibold">{formData.yourTeam}</span> will be between{' '}
                <span className="font-semibold">{result.revisedNrrMin.toFixed(3)}</span> to{' '}
                <span className="font-semibold">{result.revisedNrrMax.toFixed(3)}</span>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Result; 