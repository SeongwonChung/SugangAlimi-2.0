import React, { useEffect, useState } from 'react';
import { Footer, Card, Header, Loading } from '../components/index';
import Modal from '../components/Modal';
import AlarmModal from '../components/AlarmModal';
import UnAlarmModal from '../components/UnAlarmModal';
import styles from '../styles/Favorite.module.css';
import axios from 'axios';
import { isAuthenticated, getToken, singleFormData } from '../utils';
import { URL } from '../config/url';
import { MdLoop, MdNotificationsActive, MdNotificationsOff, MdNotifications } from 'react-icons/md';

const SERVER_URL = URL['server'];

function Favorite({ history }) {
  const [wishLists, setWishLists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alarmOn, setAlarmOn] = useState(false);
  const {
    alarm,
    unalarm,
    openAlarmModal,
    closeAlarmModal,
    openUnAlarmModal,
    closeUnAlarmModal,
  } = Modal();

  useEffect(() => {
    setLoading(true);

    let token;

    if (isAuthenticated()) {
      token = getToken();
    } else {
      alert('로그인이 필요한 기능입니다.');
      history.replace('/login');
    }

    let { formData, config } = singleFormData('token', token);
    const getWishList = async () => {
      try {
        const result = await axios.post(
          `${SERVER_URL}wishlist/`,
          formData,
          config,
        );
        
        if (!result) {
          return console.log('에러');
        }

        const wishList = result.data.wishList;
        const alarmStatus = result.data.notification
        setAlarmOn(alarmStatus)
        
        //수강신청 사이트 로그인 에러 && 마감현황 로드 에러
        const noStatus = wishList.filter((c) => c.status.length === 0);
        if (wishList.length !== 0 && noStatus.length === wishList.length) {
          alert(
            '마감현황을 조회할수 없습니다. 조회기간을 확인하거나 다시 시도해주세요!',
          );
        }

        setWishLists(wishList);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };

    getWishList();
  }, []);

  function Reload() {
    window.location.reload();
  }
  const alarmCheck = async () => {
    let token;

    if (isAuthenticated()) {
      token = getToken();
    } else {
      alert('로그인이 필요한 기능입니다.');
      history.replace('/login');
    }

    let { formData, config } = singleFormData('token', token);
    try {
      const result = await axios.post(
      `${SERVER_URL}alarmCheck/`,
      formData,
      config,
      );
      setAlarmOn(result.data.notification)
      if (alarmOn) {
        openUnAlarmModal()
      } else {
        openAlarmModal()
      }
      if (!result) {
        return console.log('에러');
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }


  return (
    <div className={styles.Total}>
      <Header />

      <>
        {loading ? (
          <Loading />
        ) : (
          <>
            {wishLists.length === 0 ? (
              <div className={styles.flex_div}>
                <h1 className={styles.h1}>!</h1>
                <p>
                  즐겨찾기에 추가된 과목이 없습니다.
                  <br />
                  과목 추가 후 현황 확인과 메일 알림이 가능합니다.
                </p>
              </div>
            ) : (
              <ul>
                {wishLists &&
                  wishLists.map((wishList) => (
                    <li key={wishList.title}>
                      <Card
                        title={wishList.title}
                        course_num={wishList.course_num}
                        class_num={wishList.class_num}
                        status={wishList.status}
                        inFavorite
                      />
                    </li>
                  ))}
              </ul>
            )}
          </>
        )}
      </>
      {alarmOn ?
      <button className={styles.alarm_on} onClick={alarmCheck}>
      <MdNotificationsActive className={styles.alarm_icon}/></button> :
      <button className={styles.alarm_off} onClick={alarmCheck}>
      <MdNotificationsOff className={styles.alarm_off_icon}/></button>
      }
      <button className={styles.reload} onClick={Reload}>
        <MdLoop className={styles.reload_icon}/>
      </button>
      <Footer className={styles.Footer} />
      <AlarmModal
        alarm={alarm}
        closeAlarmModal={closeAlarmModal}
      />
      <UnAlarmModal
        unalarm={unalarm}
        closeAlarmModal={closeUnAlarmModal}
      />
    </div>
  );
}

export default Favorite;
