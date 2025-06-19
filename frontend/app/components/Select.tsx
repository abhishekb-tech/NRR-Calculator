import React from 'react';
import FormGroup from 'react-bootstrap/FormGroup';
import FormLabel from 'react-bootstrap/FormLabel';
import FormSelect from 'react-bootstrap/FormSelect';

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: Option[];
  required?: boolean;
  error?: string;
  className?: string;
  placeholder?: string;
  onBlur?: (e: React.FocusEvent<HTMLSelectElement>) => void;
}

const Select: React.FC<SelectProps> = ({
  label,
  name,
  value,
  onChange,
  options,
  required = false,
  error,
  className = '',
  placeholder = 'Select an option',
  onBlur,
}) => {
  return (
    <FormGroup className={`mb-3 ${className}`}>
      <FormLabel>
        {label}
        {required && <span style={{ color: '#dc3545', marginLeft: '4px' }}>*</span>}
      </FormLabel>
      <FormSelect
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </FormSelect>
      {error && (
        <div style={{ color: '#dc3545', fontSize: '0.875rem', marginTop: '4px' }}>
          {error}
        </div>
      )}
    </FormGroup>
  );
};

export default Select; 