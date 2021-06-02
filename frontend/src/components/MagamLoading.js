import React from 'react';
import styles from '../styles/components/MagamLoading.module.css';

function MagamLoading() {
  return (
    <div>
      <div className={styles.wrapper}>
        <div className={styles.flex}>
          <div className={styles.loadingio_spinner_rolling_w7ld4dpn5n}>
            <div className={styles.ldio_f2yezub2v1e}>
              <div></div>
            </div>
            <p className={styles.loading_ment}>마감현황 로딩 중 입니다 !</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MagamLoading;
