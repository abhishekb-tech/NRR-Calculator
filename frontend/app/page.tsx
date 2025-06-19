'use client';

import React, { useState, useEffect } from 'react';
import { getTeams, calculateScenario } from '../lib/api';
import { Team, CalculationInput, CalculationResult } from '../lib/types';
import { validateField, validateForm } from '../lib/validation';
import Input from './components/Input';
import Select from './components/Select';
import Button from './components/Button';
import Result from './components/Result';

export default function Home() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<CalculationInput>({
    yourTeam: '',
    oppositionTeam: '',
    overs: 20,
    desiredPosition: 1,
    isBattingFirst: true,
    runsScored: 0
  });

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const teamsData = await getTeams();
        setTeams(teamsData?.data);
      } catch (error) {
        console.error('Failed to fetch teams:', error);
      }
    };
    fetchTeams();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors = validateForm(formData, teams.length);
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      return;
    }
    
    setLoading(true);
    try {
      const calculationResult = await calculateScenario(formData);
      setResult(calculationResult?.data);
    } catch (error) {
      console.error('Failed to calculate scenario:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const error = validateField(name, value, formData, teams.length);
    setErrors(prev => ({
      ...prev,
      [name]: error || ''
    }));
  };

  const handleClear = () => {
    setFormData({
      yourTeam: '',
      oppositionTeam: '',
      overs: 20,
      desiredPosition: 1,
      isBattingFirst: true,
      runsScored: 0
    });
    setResult(null);
    setErrors({});
  };

  const teamOptions = teams.map(team => ({
    value: team.name,
    label: team.name,
  }));

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">NRR Calculator</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select
              label="Your Team"
              name="yourTeam"
              value={formData.yourTeam}
              onChange={handleInputChange}
              onBlur={handleBlur}
              options={teamOptions}
              required
              error={errors.yourTeam}
              placeholder="Select Team"
            />

            <Select
              label="Opposition Team"
              name="oppositionTeam"
              value={formData.oppositionTeam}
              onChange={handleInputChange}
              onBlur={handleBlur}
              options={teamOptions}
              required
              error={errors.oppositionTeam}
              placeholder="Select Team"
            />

            <Input
              label="Overs"
              name="overs"
              type="number"
              value={formData.overs}
              onChange={handleInputChange}
              onBlur={handleBlur}
              min={1}
              max={20}
              required
              error={errors.overs}
            />

            <Input
              label="Desired Position"
              name="desiredPosition"
              type="number"
              value={formData.desiredPosition}
              onChange={handleInputChange}
              onBlur={handleBlur}
              min={1}
              max={teams.length}
              required
              error={errors.desiredPosition}
            />

            <Select
              label="Batting Order"
              name="isBattingFirst"
              value={formData.isBattingFirst.toString()}
              onChange={e => {
                setFormData(prev => ({ ...prev, isBattingFirst: e.target.value === 'true' }));
              }}
              onBlur={handleBlur}
              options={[
                { value: 'true', label: 'Batting First' },
                { value: 'false', label: 'Bowling First' },
              ]}
              required
            />

            <Input
              label={formData.isBattingFirst ? 'Runs Scored' : 'Runs to Chase'}
              name="runsScored"
              type="number"
              value={formData.runsScored}
              onChange={handleInputChange}
              onBlur={handleBlur}
              min={0}
              required
              error={errors.runsScored}
            />
          </div>

          <div className="flex justify-center gap-4">
            <Button
              type="submit"
              loading={loading}
              disabled={loading}
            >
              Calculate
            </Button>
            <Button
              type="button"
              onClick={handleClear}
              disabled={loading}
              variant="secondary"
            >
              Clear
            </Button>
          </div>
        </form>

        {result && (
          <Result
            result={result}
            formData={formData}
            className="mt-8"
          />
        )}
      </div>
    </main>
  );
} 