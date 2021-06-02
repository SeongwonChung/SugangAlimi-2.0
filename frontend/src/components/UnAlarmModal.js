import React from 'react';
import ReactDOM from 'react-dom';
import { MdNotificationsOff } from 'react-icons/md';
import styles from '../styles/components/WishModal.module.css';

const UnAlarmModal = ({ unalarm }) =>
  unalarm
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
                <MdNotificationsOff className={styles.checkoff} />
                </div>
                <div className={styles.alarm_text}>
                  메일 알림 OFF<br />더이상 빈자리 알림이 가지않아요 :(
                </div>
              </div>
            </div>
          </div>
        </React.Fragment>,
        document.body,
      )
    : null;

export default UnAlarmModal;
