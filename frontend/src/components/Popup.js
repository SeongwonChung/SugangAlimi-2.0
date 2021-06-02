import { useState, useEffect } from 'react';

const MSG_VISITED = localStorage.getItem('msgVisited');

const Popup = () => {
  const [msg, setMsg] = useState(true);
  useEffect(() => {
    return () => {
      document.querySelector('#root').style.opacity = '1';
    };
  }, []);

  const openMsgPopup = () => {
    setMsg(!msg);
  };

  const closeMsgPopup = () => {
    setMsg(!msg);
    document.querySelector('#root').style.opacity = '1';
    document.querySelector('body').style.overflow = 'scroll';
  };

  const closeMsgPopupAll = () => {
    setMsg(!msg);
    if (MSG_VISITED && MSG_VISITED > new Date()) {
      console.log('이미 있다');
      return;
    } else {
      console.log('없다');
      let expires = new Date();
      //   expires = expires.setHours(expires.getHours() + 0);
      expires = expires.setHours(expires.getHours() + 24);
      localStorage.setItem('msgVisited', expires);
    }
    document.querySelector('#root').style.opacity = '1';
    document.querySelector('body').style.overflow = 'scroll';
  };

  return {
    msg,
    MSG_VISITED,
    openMsgPopup,
    closeMsgPopup,
    closeMsgPopupAll,
  };
};

export default Popup;
