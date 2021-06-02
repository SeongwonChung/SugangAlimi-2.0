import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../styles/Login.module.css';
import { Button, Contact, GoBack } from '../components';
import GoSignup from '../components/GoSignup';
import { isAuthenticated } from '../utils';
import { URL } from '../config/url';
import alarm from '../components/alarm.png';

const SERVER_URL = URL['server'];

function Login({ history }) {
  const [inputs, setInputs] = useState({
    userId: '',
    userPw: '',
  });

  const { userId, userPw } = inputs;

  //token있으면 뒤로가기
  useEffect(() => {
    if (isAuthenticated()) {
      alert('이미 로그인 되어있습니다.');
      history.push('/favorite');
    }
  });

  const onChange = (e) => {
    const { value, name } = e.target;

    setInputs({
      ...inputs,
      [name]: value,
    });
  };

  const goReset = () => {

  }

  const postLogin = async () => {
    let formData = new FormData();

    formData.append('user_id', userId);
    formData.append('user_pw', userPw);

    const config = {
      headers: { 'content-type': 'multipart/form-data' },
    };

    try {
      const res = await axios.post(
        `${SERVER_URL}user/login/`,
        formData,
        config,
      );

      let data = res.data;

      const { error } = data;

      if (error.state) {
        console.log(error.msg);

        alert(error.msg);

        window.location.reload();
      }

      const { token } = data.user;

      const login = (token) => {
        if (token.length > 0) {
          localStorage.setItem('token', token);
          localStorage.setItem('userId', userId, JSON.stringify(userId));
          return true;
        } else {
          return false;
        }
      };

      if (login(token)) {
        history.push('/favorite');
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div>
      <GoBack />
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
        </div>
      </div>
      <div className={styles.bottom_wrapper}>
        <input
          className={styles.input}
          type="text"
          placeholder="아이디"
          name="userId"
          value={userId}
          onChange={onChange}
        />
        <input
          className={styles.input}
          type="password"
          placeholder="비밀번호"
          name="userPw"
          value={userPw}
          onChange={onChange}
        />

        <div className={styles.btn}>
          <Button text="로그인" go={postLogin} />
        </div>
        <GoSignup />
        <a className={styles.password_reset} href="https://server.ku-sugang.com/password_reset/">
          아이디/비밀번호 찾기 >
        </a>
      </div>
      <Contact />
    </div>
  );
}

export default Login;
