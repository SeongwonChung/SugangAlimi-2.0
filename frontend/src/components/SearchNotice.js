import React from 'react';
import styles from '../styles/components/SearchNotice.module.css';
import GoSupport from './GoSupport';
import { MdNotificationsActive } from 'react-icons/md';
import alarm from "../components/alarm.png";
import mail from "../components/mail.png";
import glass from "../components/magnifying-glass.png";

function SearchNotice() {
  return (
    <div className={styles.container}>
      <div className={styles.total_wrapper}>

        <div className={styles.mail_off}>
          * 메일 발송을 원하지 않으면 알림을 꺼주세요.
        </div>
        <div className={styles.main_ment_box}>
          <div className={styles.beta_alarm}>
           
              <MdNotificationsActive className={styles.alarm_icon} />
            
            <p className={styles.beta_text}>BETA</p>
            
          </div>
          <div className={styles.main_ment}>
            즐겨찾기에서 알림을 켜면 <br />
            메일로 빈자리 알려드려요.
          </div>
        </div>
        <div className={styles.how_to_use}>
          어떻게 사용해요? 
          <div className={styles.how_to_div}>

            <div className={styles.how_to_detail}>
              <img src={mail} className={styles.how_to_icon}></img>
              '학교메일'로 인증 후 로그인
            </div>

            <div className={styles.how_to_detail}>
              <img src={glass} className={styles.how_to_icon}></img>
              과목 검색 후 즐겨찾기 등록하기
            </div>

            <div className={styles.how_to_detail}>
              <img src={alarm} className={styles.how_to_icon}></img>
              알림 설정하고 편하게 빈자리 기다리기!
            </div>

          </div>
          
        </div>
          <div className={styles.go_text}>
            <GoSupport />
          </div>
        </div>
      </div>
    
  );
}

export default SearchNotice;
