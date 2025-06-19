import React from 'react';
import FormGroup from 'react-bootstrap/FormGroup';
import FormLabel from 'react-bootstrap/FormLabel';
import FormControl from 'react-bootstrap/FormControl';

interface InputProps {
  label: string;
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: 'text' | 'number';
  min?: number;
  max?: number;
  required?: boolean;
  error?: string;
  className?: string;
  placeholder?: string;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

const Input: React.FC<InputProps> = ({
  label,
  name,
  value,
  onChange,
  type = 'text',
  min,
  max,
  required = false,
  error,
  className = '',
  placeholder = '',
  onBlur,
}) => {
  return (
    <FormGroup className={`mb-3 ${className}`}>
      <FormLabel>
        {label}
        {required && <span style={{ color: '#dc3545', marginLeft: '4px' }}>*</span>}
      </FormLabel>
      <FormControl
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        min={min}
        max={max}
        placeholder={placeholder}
      />
      {error && (
        <div style={{ color: '#dc3545', fontSize: '0.875rem', marginTop: '4px' }}>
          {error}
        </div>
      )}
    </FormGroup>
  );
};

export default Input; 