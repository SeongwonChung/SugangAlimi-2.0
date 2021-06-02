import React from 'react';
import styles from '../styles/components/Button.module.css';

function Button({ isBorder, text, go }) {
  return (
    <>
      {isBorder ? (
        <>
          <button onClick={go} className={styles.border_btn}>
            {text}
          </button>
        </>
      ) : (
        <>
          <button onClick={go} className={styles.btn}>
            {text}
          </button>
        </>
      )}
    </>
  );
}

export default Button;
