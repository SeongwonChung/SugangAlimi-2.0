import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { isAuthenticated } from '../utils';
import { MdPerson } from 'react-icons/md';
import styles from '../styles/components/Hi.module.css';

function Hi() {
  const history = useHistory();

  const userId = localStorage.getItem('userId');

  const onClick = () => {
    history.push('/mypage');
  };

  if (isAuthenticated()) {
    return (
      <div className={styles.logined} onClick={onClick}>
        <MdPerson />
        Hi, {userId}
      </div>
    );
  } else {
    return <></>;
  }
}

export default Hi;
