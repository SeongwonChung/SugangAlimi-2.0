import React, { useRef } from 'react';
import { Contact, GoBack } from '../components/index';
import styles from '../styles/Support.module.css';
import { AiOutlineCopy } from 'react-icons/ai';

function Support() {
  const account = useRef();
  const accountClick = (e) => {
    account.current.select();
    console.log(document.execCommand('copy'))
    // console.log(e.target.value)
    alert('클립보드에 복사되었습니다.');
  };

  return (
    <div className={styles.container}>
      <GoBack />
      <div className={styles.top_wrapper}>
        <h1>
          서버비용 후원하기에 동참해주셔서 <br /> 진심으로 감사드립니다.
        </h1>
        <div className={styles.statement}>
          후원계좌: <br />
          하나은행 박수민
          <input
            ref={account}
            onClick={accountClick}
            defaultValue="391-911238-10707"
            className={styles.bank_number}
          />
          <AiOutlineCopy onClick={accountClick} className={styles.copy_icon} />
        </div>
        <div className={styles.notice_text}>
          "수강신청 알리미는 학우분들의   <br /> 
          수강신청이 더욱 편리해지도록{' '} 항상 노력하겠습니다."
        </div>
      </div>
      <div className={styles.bottom_wrapper}>
     
        - 수강신청 알리미 개발자 일동 드림 - <br />
        <div className={styles.developers}>
          디자인조형학부 박수민, 최주원 <br />
          미디어학부 김준태 <br />
          심리학과 정성원 <br />
          보건환경융합과학부 김범진 <br />
          중어중문학과 김현민, 정혜인 <br />
        </div>
      </div>
      <Contact />
    </div>
  );
}

export default Support;
