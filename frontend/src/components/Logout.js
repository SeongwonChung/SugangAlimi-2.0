import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import styles from '../styles/components/Logout.module.css';
import { multiFormData, getToken, isAuthenticated } from '../utils';
import { URL } from '../config/url';
const SERVER_URL = URL['server'];

function Logout() {
  const history = useHistory();

  const token = getToken();

  const onClick = async () => {
    let data = [{ key: 'token', content: token }];

    let { config, formData } = multiFormData(data);

    try {
      const result = await axios.post(
        `${SERVER_URL}user/logout/`,
        formData,
        config,
      );
    } catch (error) {
      console.log(error);
    }
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('user_id');
    history.push('/login');
  };

  const toLogin = () => {
    history.push('login');
  };

  if (isAuthenticated()) {
    return (
      <a className={styles.logout} onClick={onClick}>
        로그아웃
      </a>
    );
  } else {
    return (
      <a className={styles.login} onClick={toLogin}>
        로그인
      </a>
    );
  }
}

export default Logout;
