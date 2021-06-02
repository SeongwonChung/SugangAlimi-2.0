import React from 'react';
import styles from '../styles/components/Contact.module.css';

function Contact() {
  return (
    <div className={styles.parent}>
      <div className={styles.container}>
        <div className={styles.text_wrapper}>
          <div className={styles.contact}>contact: </div>
          <div className={styles.email}>suRforku@gmail.com</div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
