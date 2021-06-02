import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../styles/components/Card.module.css';
import { MdStarBorder, MdStar } from 'react-icons/md';
import { Loading } from '../components/index';
import Modal from '../components/Modal';
import MagamModal from '../components/MagamModal';
import WishModal from '../components/WishModal';
import UnWishModal from '../components/UnWishModal';
import FullWishModal from '../components/FullWishModal';
import { isAuthenticated, getToken, multiFormData } from '../utils';
import { useHistory } from 'react-router-dom';
import { URL } from '../config/url';
const SERVER_URL = URL['server'];

function Card({ title, course_num, class_num, status, inFavorite, prof_name }) {
  const history = useHistory();
  const {
    loading,
    setLoading,
    magam,
    setMagam,
    wish,
    unwish,
    fullwish,
    openMagamModal,
    closeMagamModal,
    openWishModal,
    closeWishModal,
    openUnWishModal,
    closeUnWishModal,
    openFullWishModal,
    closeFullWishModal,
  } = Modal();

  const [wished, setWished] = useState(false);
  const [blue, setBlue] = useState(false);
  const [newStatus, setNewStatus] = useState([]);

  useEffect(() => {
    setMagam(false);
    setBlue(false);
    setLoading(false);
    if (status && status.length > 0) {
      const parsedLimit =
        status[6].limit.indexOf('+') !== -1
          ? String(
              Number(status[6].limit.split('+')[0])
              // 정정 아니면 50 51 주석처리 
              +
              Number(status[6].limit.split('+')[1])
            )
          : status[6].limit;
      if (status.length > 0 && parsedLimit) {
        if (Number(status[6].apply) < Number(parsedLimit)) {
          setBlue(true);
        }
      }
    }

    async function wishCheck() {
      let info = [
        { key: 'course_num', content: course_num },
        { key: 'class_num', content: class_num },
      ];

      let token;

      if (isAuthenticated()) {
        token = getToken();
      }

      info = info.concat({ key: 'token', content: token });

      let { config, formData } = multiFormData(info);

      try {
        const res = await axios.post(
          `${SERVER_URL}wishCheck/`,
          formData,
          config,
        );

        if (res.data.wished === 1) {
          return setWished(true);
        } else {
          return setWished(false);
        }
      } catch (e) {
        console.log(e);
      }
      console.log('rendering...');
    }

    wishCheck();
  }, []);

  const onClick = async () => {
    let info = [
      { key: 'course_num', content: course_num },
      { key: 'class_num', content: class_num },
    ];

    let token;

    if (isAuthenticated()) {
      token = getToken();
    } else {
      alert('로그인이 필요한 기능입니다.');
      history.push('/login');
    }

    info = info.concat({ key: 'token', content: token });

    let { config, formData } = multiFormData(info);

    try {
      const res = await axios.post(`${SERVER_URL}wish/`, formData, config);
      if (res.data.exist === 1) {
        setWished(true);
        openWishModal();
      } else if (res.data.exist === 0) {
        setWished(false);
        openUnWishModal();
      } else {
        openFullWishModal();
      }
      if (inFavorite) {
        //즐겨찾기 바뀌면 Favorite reload
        window.location.reload();
      }
    } catch (e) {
      console.log(e);
    }
  };

  const magamClick = async () => {
    if (!inFavorite) {
      try {
        setLoading(true);
        openMagamModal();
        let info = [
          { key: 'course_num', content: course_num },
          { key: 'class_num', content: class_num },
        ];

        let { config, formData } = multiFormData(info);
        const res = await axios.post(`${SERVER_URL}status/`, formData, config);
        console.log(res)
        setNewStatus(res.data.status);

        setLoading(false);
        if (res.data.status.length === 0) {
          throw new Error(
            '마감현황을 조회할수 없습니다. 조회기간을 확인하거나 다시 시도해주세요!',
          );
        }
      } catch (e) {
        alert(e.message);
      }
    } else {
      openMagamModal();
    }
  };
  return (
    <div className={styles.container}>
      <div className={styles.sizing_container}>
        <div className={styles.top_wrapper}>
          <div className={styles.text_wrapper}>
            <h2>{title}</h2>
            <div className={styles.selected_like_wrapper} onClick={onClick}>
              {wished ? (
                <>
                  <MdStar />
                  <p>즐겨찾기</p>
                </>
              ) : (
                <>
                  <MdStarBorder />
                  <p>즐겨찾기</p>
                </>
              )}
            </div>
          </div>

          <h4 className={styles.course_num}>
            {course_num}-{class_num}
          </h4>
        </div>
        {/* <div className={styles.dashed_line}></div> */}
        <div className={styles.bottom_wrapper}>
          <div className={styles.result_text_wrapper}>
            <div className={styles.result_total_text}>
              {!inFavorite
                ? prof_name !== ''
                  ? prof_name + ' 교수님'
                  : '미정'
                : '전체'}
            </div>
            <div
              className={
                blue ? styles.result_total_num_blue : styles.result_total_num
              }
            >
              {inFavorite && status
                ? status.length > 0
                // 정정 아니면 207 주석 해제 208 주석
                  // ? String(Number(status[6].apply)-Number(status[4].apply)-Number(status[5].apply)) +
                  ? status[6].apply +
                    '/' +
                    (status[6].limit.indexOf('+') !== -1
                      ? String(
                          Number(status[6].limit.split('+')[0])
                          // 정정 아니면 214 215 주석처리
                          +
                          Number(status[6].limit.split('+')[1])
                        )
                      : status[6].limit)
                  : '-' + '/' + '-'
                : ''}
            </div>
          </div>
          <button onClick={magamClick} className={styles.detail_btn}>
            마감 현황
          </button>
          <MagamModal
            loading={loading}
            magam={magam}
            closeMagamModal={closeMagamModal}
            title={title}
            course_num={course_num}
            class_num={class_num}
            status={inFavorite ? status : newStatus}
          />
          <WishModal
            wish={wish}
            closeWishModal={closeWishModal}
            title={title}
          />
          <UnWishModal
            unwish={unwish}
            closeUnWishModal={closeUnWishModal}
            title={title}
          />
          <FullWishModal
            fullwish={fullwish}
            closeFullWishModal={closeFullWishModal}
          />
        </div>
      </div>
    </div>
  );
}

export default Card;
