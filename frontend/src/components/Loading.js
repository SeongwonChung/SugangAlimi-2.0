import React from 'react';
import styles from '../styles/components/Loading.module.css';

function Loading({ isSearch }) {
  return (
    <div>
      <div className={styles.wrapper}>
        <div className={styles.loadingio_spinner_rolling_3sxs8b04ins}>
          <div className={styles.ldio_j8f2m0g0q8}>
            <div></div>
          </div>
        </div>
      </div>
      <>
        {isSearch ? (
          <p className={styles.loading_ment}>
            페이지 로딩 중 입니다 !
            <br />
            빠른 검색을 위해 교수님명으로 검색을 권장합니다 :)
          </p>
        ) : (
          <p className={styles.loading_ment}>
            {' '}
            즐겨찾기의 마감현황을 로딩 중 입니다 !
          </p>
        )}
      </>
    </div>
  );
}

export default Loading;
