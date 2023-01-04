import { FC, ChangeEventHandler } from 'react';

interface InputProps {
  title: string;
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
}

const Input: FC<InputProps> = ({ title, value, onChange }) => {
  return (
    <label>
      <span>{title}</span>

      <input type="text" value={value} onChange={onChange} />
    </label>
  );
};

export default Input;
