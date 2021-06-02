import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  SearchBar,
  SearchNotice,
  Footer,
  Card,
  Header,
  Loading,
} from '../components/index';
import styles from '../styles/Search.module.css';
import { singleFormData } from '../utils';
import { URL } from '../config/url';
import Popup from '../components/Popup';
import MsgPopup from '../components/MsgPopup';
// import Popup from '../components/popup'
const SERVER_URL = URL['server'];


function Search() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // 팝업
  const {
    msg,
    MSG_VISITED,
    openMsgPopup,
    closeMsgPopup,
    closeMsgPopupAll,
  } = Popup();
  // 팝업 쓸거면 디폴트를 true로 변경, 41 42 주석해제 
  const [showPopup, setShowPopup] = useState(true);
  
  useEffect(() => {
    if (MSG_VISITED && MSG_VISITED > new Date()) {
      setShowPopup(false)
      return;
    } else {
      document.querySelector('#root').style.opacity = '0.5';
      document.querySelector('body').style.overflow = 'hidden';
    }

  }, [MSG_VISITED])

  const onChange = (e) => {
    setQuery(e.target.value);
  };

  let { config, formData } = singleFormData('query', query);

  const onClick = async () => {
    try {
      if (query === '') {
        throw new Error('검색어를 입력하세요');
      }
      setLoading(true);
      const res = await axios.post(`${SERVER_URL}search/`, formData, config);

      if (res.data.courses.length === 0) {
        throw new Error('해당 검색어에 대한 결과가 없습니다.');
      }

      // const noStatus = res.data.courses.filter((c) => c.status.length === 0)
      // if (noStatus.length === res.data.courses.length) {
      //   alert('현재 마감현황 조회기간이 아닙니다. 과목 조회만 가능합니다.')
      // }

      setResult(res.data.courses);
      setLoading(false);
    } catch (e) {
      alert(e.message);
      setLoading(false);
    }
  };

  const onKeyDown = async function (event) {
    if (event.key === 'Enter') {
      try {
        if (query === '') {
          throw new Error('검색어를 입력하세요');
        }
        setLoading(true);
        const res = await axios.post(`${SERVER_URL}search/`, formData, config);

        if (res.data.courses.length === 0) {
          throw new Error('해당 검색어에 대한 결과가 없습니다.');
        }

        // const noStatus = res.data.courses.filter((c) => c.status.length === 0)
        // if (noStatus.length === res.data.courses.length) {
        //   alert('현재 마감현황 조회기간이 아닙니다. 과목 조회만 가능합니다.')
        // }

        setResult(res.data.courses);
        setLoading(false);
      } catch (e) {
        alert(e.message);
        setLoading(false);
      }
    }
  };
  return (
    <div>
      <div className={styles.container}>
        <div>
          <Header />
        </div>

        <SearchBar
          query={query}
          onClick={onClick}
          onChange={onChange}
          onKeyDown={onKeyDown}
        />

        <>
          {loading ? (
            <Loading isSearch />
          ) : (
            <>
              {result.length === 0 ? (
                <SearchNotice />
              ) : (
                <div className={styles.CardBox}>
                  {result.map((c, index) => (
                    <Card
                      key={index}
                      title={c.title}
                      course_num={c.course_num}
                      class_num={c.class_num}
                      prof_name={c.prof_name}
                      status={false}
                      inFavorite={false}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </>
        {showPopup && <MsgPopup
          msg={msg}
          closeMsgPopup={closeMsgPopup}
          closeMsgPopupAll={closeMsgPopupAll}
        />}
        <Footer className={styles.footer} isSearch={true} />
      </div>
    </div>
  );
}

export default Search;
