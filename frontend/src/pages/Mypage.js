import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { Button, Footer, GoBack, Header, Hi, Logout } from '../components/index';
import { GoSupport } from '../components';
import styles from '../styles/Mypage.module.css';
import { multiFormData, getToken, isAuthenticated } from '../utils';
import { URL } from '../config/url';
import mail_icon from '../components/love.png';

const SERVER_URL = URL['server'];

function Mypage() {
  const history = useHistory();

  const token = getToken();
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")

  let data = [{ key: 'token', content: token }];

  let { config, formData } = multiFormData(data);
  const getUserData = async () => {
    try {
      const result = await axios.post(
        `${SERVER_URL}user/mypage/`,
        formData,
        config,
      );
      console.log(result.data)
      if (result.data.error.state) {
        throw new Error(result.data.error.msg);
      }
      if (result.data.success) {
        console.log(result.data)
        setName(result.data.username)
        setEmail(result.data.email)
      }
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    getUserData()
  },[])

  const onClick = async () => {


    try {
      const result = await axios.post(
        `${SERVER_URL}user/withdraw/`,
        formData,
        config,
      );

      if (result.data.error.state) {
        throw new Error(result.data.error.msg);
      }

      if (result.data.success) {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('user_id');
        alert('회원탈퇴 완료되었습니다!');
        history.push('/');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const toLanding = () => {
    history.push('/');
  };

  // if (isAuthenticated()) {
  let red_text = {color: '#8b0128', fontWeight: 'bold', fontSize: '15px', width: '260px', wordBreak: 'break-all', display: 'block'}
  let red_bold_text = {color: '#8b0128', fontWeight: 'bold', fontSize: '18px',}
  let component_flex = {display: 'flex',alignItems: 'flex-end',lineHeight: '35px'}
  return (
    
    // <a className={styles.withdraw} onClick={onClick}>회원탈퇴</a>
    <div>
      <div style={component_flex}>
        <GoBack />
        <p style={red_bold_text}>MYPAGE</p>
      </div>
      <div className={styles.top_wrapper}>
        {/* <h1>회원탈퇴하기</h1> */}
        <div className={styles.ment_off}>
        * 메일 수정을 원하시면, 탈퇴 후 재가입 해주세요 :)
        </div>
        <div className={styles.ment_box}>
          <div className={styles.text_box}>
            '{name}'님의 메일
            <img src={mail_icon} className={styles.mail_icon}></img>
            <br/>
            <span style={red_text}>{email}</span>
          </div>
        </div>
        <div className={styles.statement}>
          {/* <p>서비스를 이용해주셔서 감사드리며</p>
          <p>더 나은 서비스를 제공하기 위해 노력하겠습니다</p> */}
        </div>
      </div>
      <div className={styles.bottom_wrapper}>
        <Button go={toLanding} text="계속 이용하기" isBorder={true}></Button>
        <Button go={onClick} text="회원 탈퇴"></Button>
        <GoSupport />
      </div>
      {/* <Footer /> */}
    </div>
  );
  // } else {
  //     return (
  //         <a className={styles.login} onClick={toLogin}>로그인</a>
  //     );
  // }
}

export default Mypage;
