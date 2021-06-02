import React, { useEffect } from 'react';
import { Button, Contact } from '../components/index';
import styles from '../styles/Landing.module.css';
import { GoSupport } from '../components';
import { isAuthenticated } from '../utils';
import alarm from '../components/alarm.png';

function Landing({ history }) {
  // useEffect(() => {
  //   if (isAuthenticated()) {
  //     history.replace("/favorite");
  //   }
  // });
  // useEffect(() => {
  //   alert('현재 서버 장애로 인해 점검중입니다. 불편을 드려 죄송합니다.');
  // });

  const goSearch = () => {
    // alert("잠시 서버 점검 중 입니다. 불편을 드려 죄송합니다.");
    // window.location.reload();
    history.push('/search');
  };

  const goLogin = () => {
    // alert("잠시 서버 점검 중 입니다. 불편을 드려 죄송합니다.");
    // window.location.reload();
    history.push('/login');
  };

  if (isAuthenticated()) {
    return (
      <div className={styles.container}>
        <div className={styles.top_wrapper}>
          <h1>
            당신의 올클을 위한 <br /> 수강신청 알리미.
          </h1>
          <div className={styles.statement}>
            즐겨찾기에 과목 등록하고 마감현황을 한 눈에 확인, <br />
            메일로 알림 발송까지
            <img src={alarm} className={styles.alarm_icon}></img>
            {/* 신입생 수강신청기간에는 메일알림기능을{' '}
            <img src={alarm} className={styles.alarm_icon}></img>
            <br />
            사용할 수 없습니다. */}
          </div>
          <div className={styles.notice_text}>
            * 로그인 후 즐겨찾기와 알림 기능 사용 가능
            {/* * 로그인 후
            즐겨찾기 기능 사용 가능 */}
          </div>
        </div>
        <div className={styles.bottom_wrapper}>
          <Button go={goSearch} text="마감현황 보기 >"></Button>
          <GoSupport />
        </div>
        <Contact />
      </div>
    );
  } else {
    return (
      <div className={styles.container}>
        <div className={styles.top_wrapper}>
          <h1>
            당신의 올클을 위한 <br /> 수강신청 알리미.
          </h1>
          <div className={styles.statement}>
            즐겨찾기에 과목 등록하고 마감현황을 한 눈에 확인, <br />
            메일로 알림 발송까지
            <img src={alarm} className={styles.alarm_icon}></img>
            {/* 신입생 수강신청기간에는 메일알림기능을{' '}
            <img src={alarm} className={styles.alarm_icon}></img>
            <br />
            사용할 수 없습니다. */}
          </div>
          <div className={styles.notice_text}>
            * 로그인 후 즐겨찾기와 알림 기능 사용 가능
            {/* * 로그인 후 즐겨찾기 기능 사용 가능 */}
          </div>
        </div>
        <div className={styles.bottom_wrapper}>
          <Button go={goLogin} text="로그인 하기 >" isBorder={true}></Button>
          <Button go={goSearch} text="마감현황 보기 >"></Button>
          <GoSupport />
        </div>
        <Contact />
      </div>
    );
  }
}

export default Landing;
