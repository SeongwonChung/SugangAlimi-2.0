import React from 'react';
import ReactDOM from 'react-dom';
import { MdWarning} from 'react-icons/md';
import styles from '../styles/components/WishModal.module.css';

let red_text = {color: '#8b0128', fontWeight: 'bold', fontSize: '16px'}
const FullWishModal = ({ fullwish }) =>
  fullwish
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
                <div className={styles.Full_Modal} >
                  즐겨찾기는 <span style={red_text}>최대 3개</span> 까지만
                  <br/>등록할 수 있습니다.
                </div> 
                <div className={styles.Modal_footer}>
                  <MdWarning className={styles.check} />
                </div>
              </div>
            </div>
          </div>
        </React.Fragment>,
        document.body,
      )
    : null;

export default FullWishModal;
