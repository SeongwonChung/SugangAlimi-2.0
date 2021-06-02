import React from 'react';
import { Logout, Hi } from './index';
import styles from '../styles/components/Header.module.css';

function Header() {
  return (
    <div className={styles.flex_div}>
      <Hi />
      <Logout />
    </div>
  );
}

export default Header;
