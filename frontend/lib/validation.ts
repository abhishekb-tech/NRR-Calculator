import { CalculationInput } from './types';

export const validateField = (
  fieldName: string, 
  value: any, 
  allFormData: CalculationInput,
  totalTeams: number
): string | null => {
  switch (fieldName) {
    case 'yourTeam':
      return !value ? 'Please select your team' : null;
    case 'oppositionTeam':
      if (!value) return 'Please select opposition team';
      if (value === allFormData.yourTeam) return 'Opposition team must be different from your team';
      return null;
    case 'overs':
      return !value || value < 1 || value > 20 ? 'Overs must be between 1 and 20' : null;
    case 'desiredPosition':
      return !value || value < 1 || value > totalTeams ? `Position must be between 1 and ${totalTeams}` : null;
    case 'runsScored':
      return value < 0 ? 'Runs must be a positive number' : null;
    default:
      return null;
  }
};

export const validateForm = (
  formData: CalculationInput,
  totalTeams: number
): Record<string, string> => {
  const errors: Record<string, string> = {};
  const fieldsToValidate: (keyof CalculationInput)[] = [
    'yourTeam',
    'oppositionTeam',
    'overs',
    'desiredPosition',
    'runsScored'
  ];

  fieldsToValidate.forEach(field => {
    const error = validateField(field, formData[field], formData, totalTeams);
    if (error) {
      errors[field] = error;
    }
  });

  return errors;
}; 