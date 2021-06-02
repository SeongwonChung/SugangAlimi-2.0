import React from 'react';
import { MdSearch, MdStarBorder, MdStar } from 'react-icons/md';
import styles from '../styles/components/Footer.module.css';
import { withRouter } from 'react-router-dom';
import { isAuthenticated } from '../utils';

function Footer({ history, isSearch }) {
  const goPages = (page) => {
    history.push(page);
  };

  return (
    <>
      {isSearch ? (
        <div className={styles.container}>
          <div onClick={() => window.location.reload()} className={styles.btn}>
            <MdSearch className={styles.selected} />
            <div className={styles.selected_text}>과목 조회</div>
          </div>
          <div
            onClick={() => {
              if (isAuthenticated()) {
                goPages('/favorite');
              } else {
                alert('로그인이 필요한 기능입니다.');
                history.replace('/login');
              }
            }}
            className={styles.btn}
          >
            <MdStarBorder className={styles.unselected} />
            <div className={styles.unselected_text}>즐겨찾기</div>
          </div>
        </div>
      ) : (
        <div className={styles.container}>
          <div onClick={() => goPages('/search')} className={styles.btn}>
            <MdSearch className={styles.unselected} />
            <div className={styles.unselected_text}>과목 조회</div>
          </div>
          <div className={styles.btn}>
            <MdStar className={styles.selected} />
            <div className={styles.selected_text}>즐겨찾기</div>
          </div>
        </div>
      )}
    </>
  );
}

export default withRouter(Footer);
