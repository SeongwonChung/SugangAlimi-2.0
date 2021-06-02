import React, { useState, useEffect } from 'react';
import styles from '../styles/Signup.module.css';
import { Button, Contact, GoBack } from '../components';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { multiFormData } from '../utils';
import { URL } from '../config/url';
const SERVER_URL = URL['server'];

function Signup() {
  const history = useHistory();

  const [inputs, setInputs] = useState({
    user_id: '',
    user_email: '',
    user_pw: '',
    user_pw_check: '',
  });

  const { user_id, user_email, user_pw, user_pw_check } = inputs;

  const inputHandler = (e) => {
    const { value, name } = e.target;

    setInputs({
      ...inputs,
      [name]: value.replace(/(\s*)/g, ''),
    });
  };

  const postSignup = async () => {
    let data = [
      { key: 'user_id', content: user_id },
      { key: 'user_email', content: user_email },
      { key: 'user_pw', content: user_pw },
      { key: 'user_pw_check', content: user_pw_check },
    ];

    let { config, formData } = multiFormData(data);

    try {
      const result = await axios.post(
        `${SERVER_URL}user/signup/`,
        formData,
        config,
      );

      let data = JSON.parse(result.data);

      const { error } = data;

      if (error.state) {
        console.log(error.msg);

        alert(error.msg);

        window.location.reload();
      } else {
        alert('가입되었습니다! 로그인 후 사용 가능합니다.');
        history.push('login/');
      }

      // const { token } = data.user;
      // const userId = user_id;
      // // settoken
      // const login = (token) => {
      //   if (token.length > 0) {
      //     localStorage.setItem('token', token);
      //     localStorage.setItem('userId', userId, JSON.stringify(userId));
      //     return true;
      //   } else {
      //     return false;
      //   }
      // };

      // if (login(token)) {
      //   // 로그인 성공 했을 경우에 즐찾으로 이동
      //   history.push('/favorite');
      // }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <GoBack />
      <div className={styles.top_wrapper}>
        <h2 className={styles.h2}>회원가입</h2>
        <p className={styles.statement}>
          회원가입을 하시면, <br />
          즐겨찾기와 이메일 알림 기능을 사용할 수 있습니다.
        </p>
      </div>

      <p className={styles.mustOrOption}>*필수 입력</p>

      <div className={styles.middle_wrapper}>
        <input
          className={styles.input}
          type="text"
          placeholder="아이디"
          name="user_id"
          onChange={inputHandler}
          value={user_id}
        />
        <input
          className={styles.input}
          type="password"
          placeholder="비밀번호"
          name="user_pw"
          onChange={inputHandler}
          value={user_pw}
        />
        <input
          className={styles.input}
          type="password"
          placeholder="비밀번호 확인"
          name="user_pw_check"
          onChange={inputHandler}
          value={user_pw_check}
        />
        {/* <div className={styles.ifFreshman}>
          <p>*신입생인 경우 학번 입력</p>
              
        </div> */}
        <div className={styles.mailbox}>
          <input
            className={styles.mailInput}
            type="text"
            placeholder="학교 이메일"
            name="user_email"
            onChange={inputHandler}
            value={user_email}
          />
          <p className={styles.mailText}>@korea.ac.kr</p>
        </div>
      </div>

      <div className={styles.middle_wrapper}>
        <div className={styles.btn}>
          <Button text="회원가입" go={postSignup} />
        </div>
        <Contact />
      </div>
    </div>
  );
}

export default Signup;
