import { FC } from 'react';

interface ButtonProps {
  className: string;
  onClick: () => void;
  type?: 'submit' | 'button';
  text: string;
}

const Button: FC<ButtonProps> = ({ className, onClick, type, text }) => {
  return (
    <button className={className} onClick={onClick} type={type || 'button'}>
      {text}
    </button>
  );
};

export default Button;
