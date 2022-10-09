import styles from './App.module.css';
import React,{
  useEffect,
  useRef,
} from 'react';
type InputWithLabelProps = {
  id: string;
  value: string;
  type?: string;
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isFocused?: boolean;
  children: React.ReactNode;
}

const InputWithLabel = ({ id, value, type = 'text', isFocused ,onInputChange, children }:InputWithLabelProps) => {
  const inputRef = useRef<HTMLInputElement>(null!);
  useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isFocused]);
  return (
    <>
      <label htmlFor={id} className={styles.label}>{children}</label>
      &nbsp;
      <input ref={inputRef} id={id} type={type} value={value} className={styles.input} onChange={onInputChange} />
    </>
  );
}

export default InputWithLabel;