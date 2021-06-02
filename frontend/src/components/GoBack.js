import React, { useEffect } from 'react';
import styles from '../styles/components/GoBack.module.css';
import { useHistory } from 'react-router-dom';
import { MdKeyboardArrowLeft } from 'react-icons/md';
import { isAuthenticated } from '../utils';

function GoBack() {
  let history = useHistory();

  const goBack = () => {
    history.goBack();
  };

  return <MdKeyboardArrowLeft className={styles.goBack} onClick={goBack} />;
}

export default GoBack;
