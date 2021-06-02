import React from 'react';
import ReactDOM from 'react-dom';
import { IoIosCloseCircleOutline } from 'react-icons/io';
import styles from '../styles/components/WishModal.module.css';

const UnWishModal = ({ unwish, title }) =>
  unwish
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
                <div className={styles.Modal}>
                  {title}을(를)
                  <br />
                  즐겨찾기에서 삭제하였습니다.
                </div>
                <div className={styles.Modal_footer}>
                  <IoIosCloseCircleOutline className={styles.check} />
                </div>
              </div>
            </div>
          </div>
        </React.Fragment>,
        document.body,
      )
    : null;

export default UnWishModal;
