import { useState, useEffect } from 'react';

const Modal = () => {
  useEffect(() => {
    return () => {
      document.querySelector('#root').style.opacity = '1';
    };
  }, []);

  const [wish, setWish] = useState(false);
  const [unwish, setUnWish] = useState(false);
  const [fullwish, setFullWish] = useState(false);
  
  const [alarm, setAlarm] = useState(false);
  const [unalarm, setUnAlarm] = useState(false);

  const [magam, setMagam] = useState(false);
  const [loading, setLoading] = useState(false);
  // 마감현황

  const openMagamModal = () => {
    setMagam(!magam);
    document.querySelector('#root').style.opacity = '0.5';
    document.querySelector('body').style.overflow = 'hidden';
  };

  const closeMagamModal = () => {
    setMagam(!magam);
    if (setMagam(false)) {
      console.log('default');
    } else {
      document.querySelector('#root').style.opacity = '1';
      document.querySelector('body').style.overflow = 'scroll';
    }
  };

  // 즐찾
  const openWishModal = () => {
    setWish(!wish);
    document.querySelector('#root').style.opacity = '0.5';
    document.querySelector('body').style.overflow = 'hidden';
    setTimeout(() => {
      closeWishModal();
    }, 1000);
  };

  const closeWishModal = () => {
    setWish(!wish);
    if (setWish(false)) {
      console.log('default');
    } else {
      document.querySelector('#root').style.opacity = '1';
      document.querySelector('body').style.overflow = 'scroll';
    }
  };

  // 즐찾해제
  const openUnWishModal = () => {
    setUnWish(!unwish);
    document.querySelector('#root').style.opacity = '0.5';
    document.querySelector('body').style.overflow = 'hidden';
    setTimeout(() => {
      closeUnWishModal();
    }, 1000);
  };

  const closeUnWishModal = () => {
    setUnWish(!unwish);
    if (setUnWish(false)) {
      console.log('default');
    } else {
      document.querySelector('#root').style.opacity = '1';
      document.querySelector('body').style.overflow = 'scroll';
    }
  };

  // 즐찾 3개 이상 
  const openFullWishModal = () => {
    setFullWish(!fullwish);
    document.querySelector('#root').style.opacity = '0.5';
    document.querySelector('body').style.overflow = 'hidden';
    setTimeout(() => {
      closeFullWishModal();
    }, 1000);
  };

  const closeFullWishModal = () => {
    setFullWish(!fullwish);
    if (setFullWish(false)) {
      console.log('default');
    } else {
      document.querySelector('#root').style.opacity = '1';
      document.querySelector('body').style.overflow = 'scroll';
    }
  };

  // 알람 on/off 
  const openAlarmModal = () => {
    setAlarm(!alarm);
    document.querySelector('#root').style.opacity = '0.5';
    document.querySelector('body').style.overflow = 'hidden';
    setTimeout(() => {
      closeAlarmModal();
    }, 1000);
  };

  const closeAlarmModal = () => {
    setAlarm(!alarm);
    if (setAlarm(false)) {
      console.log('default');
    } else {
      document.querySelector('#root').style.opacity = '1';
      document.querySelector('body').style.overflow = 'scroll';
    }
  };

  const openUnAlarmModal = () => {
    setUnAlarm(!unalarm);
    document.querySelector('#root').style.opacity = '0.5';
    document.querySelector('body').style.overflow = 'hidden';
    setTimeout(() => {
      closeUnAlarmModal();
    }, 1000);
  };

  const closeUnAlarmModal = () => {
    setUnAlarm(!unalarm);
    if (setUnAlarm(false)) {
      console.log('default');
    } else {
      document.querySelector('#root').style.opacity = '1';
      document.querySelector('body').style.overflow = 'scroll';
    }
  };

  // 마감모달 로딩
  const startLoading = () => {
    setLoading(true);
  };
  const endLoading = () => {
    setLoading(false);
  };
  return {
    loading,
    setLoading,
    wish,
    unwish,
    fullwish,
    alarm,
    unalarm,
    magam,
    setMagam,
    openMagamModal,
    closeMagamModal,
    openWishModal,
    closeWishModal,
    openUnWishModal,
    closeUnWishModal,
    openFullWishModal,
    closeFullWishModal,
    openAlarmModal,
    closeAlarmModal,
    openUnAlarmModal,
    closeUnAlarmModal,
  };
};

export default Modal;
