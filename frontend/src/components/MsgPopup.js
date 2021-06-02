import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { MdClear } from 'react-icons/md';
import styles from '../styles/components/Popup.module.css';

let red_text = {
  color: '#8b0128',
  fontWeight: 'bold',
  fontSize: '12px',
  textDecoration: 'underline',
  cursor: 'pointer',
};
let bold_text = { fontWeight: 'bold', fontSize: '12px' };
const MsgPopup = ({ msg, closeMsgPopup, closeMsgPopupAll }) => {
  return msg
    ? ReactDOM.createPortal(
        <React.Fragment>
          <div className={styles.Popup_overlay}>
            <div
              className={styles.Popup_wrapper}
              aria-hidden="true"
              tabIndex={-1}
              role="dialog"
            >
              <div
                className={styles.Popup_content}
                data-backdrop="static"
                data-keyboard="false"
              >
                <div className={styles.Popup_header}>
                  <div className={styles.Title}>
                    <h2>필독! 공지사항</h2>
                  </div>
                  <div className={styles.Button}>
                    <button
                      type="button"
                      className={styles.Popup_button}
                      data-dismiss="modal"
                      aria-label="Close"
                      onClick={closeMsgPopup}
                    >
                      <span>
                        <MdClear className={styles.Icon} aria-hidden="true" />
                      </span>
                    </button>
                  </div>
                </div>
                <div className={styles.Popup}>
                  빈자리 메일 알림 기능을 사용하시려면 <br />
                  즐겨찾기 페이지에서 알림을 활성화해주세요!
                  <br />
                  <br />
                  메일이 오지 않을 경우 스팸메일함을 확인해주세요.
                  <br />
                  <br />
                  현재 인증메일 관련 문의가 많아 전체정정기간동안 <br />
                  가입 후 바로 사용가능하도록 조치하였습니다.
                </div>
                <div className={styles.Popup_footer}>
                  <span onClick={closeMsgPopupAll} style={red_text}>
                    오늘하루 보지 않기
                  </span>
                </div>
              </div>
            </div>
          </div>
        </React.Fragment>,
        document.body,
      )
    : null;
};

export default MsgPopup;

// useEffect(() => {
//     return () => {
//       document.querySelector('#root').style.opacity = '1';
//     };
//   }, []);
// useEffect(() => {
//   return () => {
//     document.querySelector('#root').style.opacity = '1';
//   };
// }, []);

// const [reset, setReset] = useState(false);

// const openResetPopup = () => {
//     setReset(!reset);
//     document.querySelector('#root').style.opacity = '0.5';
//     document.querySelector('body').style.overflow = 'hidden';
// };

// const closeResetPopup = () => {
//     setReset(!reset);
//     if (setReset(false)) {
//         console.log('default');
//     } else {
//         document.querySelector('#root').style.opacity = '1';
//         document.querySelector('body').style.overflow = 'scroll';
//     }
// };
// return {
//     setReset,
//     openResetPopup,
//     closeResetPopup,
// };
