import React from 'react';
import ReactDOM from 'react-dom';
import { MdNotificationsActive } from 'react-icons/md';
import styles from '../styles/components/WishModal.module.css';

const AlarmModal = ({ alarm }) =>
  alarm
    ? ReactDOM.createPortal(
        <React.Fragment>
          <div className={styles.Modal_overlay}>
            <div
              className={styles.Modal_wrapper}
              aria-modal="true"
              aria-hidden="true"
              tabIndex={-1}
              role="dialog"
            >
              <div
                className={styles.Modal_content}
                data-backdrop="static"
                data-keyboard="false"
              >
                <div className={styles.alarm_icon}>
                <MdNotificationsActive className={styles.check} />
                </div>
                <div className={styles.alarm_text}>
                  메일 알림 ON<br />빈자리가 생기면 메일로 알려드려요 :)
                </div>
              </div>
            </div>
          </div>
        </React.Fragment>,
        document.body,
      )
    : null;

export default AlarmModal;
