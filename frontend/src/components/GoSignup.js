import React from 'react';
import styles from '../styles/components/GoSignup.module.css';
import { useHistory } from 'react-router-dom';

function GoSignup() {
  let history = useHistory();

  const GoSignup = () => {
    history.push('/signup');
  };

  return (
    <div className={styles.GoSignup} onClick={GoSignup}>
      {' '}
      회원가입하기 >{' '}
    </div>
  );
}

export default GoSignup;
