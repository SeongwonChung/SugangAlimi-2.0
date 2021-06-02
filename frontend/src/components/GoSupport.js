import React from 'react';
import styles from '../styles/components/GoSupport.module.css';
import { useHistory } from 'react-router-dom';

function GoSupport() {
  let history = useHistory();

  const goSupport = () => {
    history.push('/support');
  };

  return (
    <div className={styles.support} onClick={goSupport}>
      서버비용 후원하기 &gt;{' '}
    </div>
  );
}

export default GoSupport;
