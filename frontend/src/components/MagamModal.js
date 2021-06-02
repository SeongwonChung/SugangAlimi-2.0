import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { MdClear } from 'react-icons/md';
import styles from '../styles/components/MagamModal.module.css';
import { MagamLoading } from '../components/index';

// let total = status[6].limit
//   if ('+') {
//     const limit1 = int(total.split('+')[0])
//     const limit2 = int(total.split('+')[1])
//     let total = str(limit1+limit2)
//   }

const MagamModal = ({ loading, magam, closeMagamModal, title, status }) => {
  return magam
    ? ReactDOM.createPortal(
        <React.Fragment>
          <div className={styles.Modal_overlay}>
            <div className={styles.divForSpinner}>
              {loading ? (
                <MagamLoading />
              ) : (
                <div
                  className={styles.Modal_wrapper}
                  aria-modal="true"
                  aria-hidden="true"
                  tabIndex={-1}
                  role="dialog"
                >
                  <div
                    className={styles.Modal_content}
                    data-backdrop="static"
                    data-keyboard="false"
                  >
                    <div className={styles.Modal_header}>
                      <div className={styles.Title}>
                        <h2>{title} 마감 현황</h2>
                      </div>
                      <div className={styles.Button}>
                        <button
                          type="button"
                          className={styles.Modal_button}
                          data-dismiss="modal"
                          aria-label="Close"
                          onClick={closeMagamModal}
                        >
                          <span>
                            <MdClear
                              className={styles.Icon}
                              aria-hidden="true"
                            />
                          </span>
                        </button>
                      </div>
                    </div>

                    <div className={styles.Modal}>
                      <div className={styles.Modal_grade}>1학년</div>
                      <div>
                        <span className={styles.Modal_count}>
                          {status.length > 0 ? status[0].apply : '-'}/
                          {status.length > 0 ? status[0].limit : '-'}
                        </span>
                      </div>
                      <div className={styles.Modal_grade}>2학년</div>
                      <div>
                        <span className={styles.Modal_count}>
                          {status.length > 0 ? status[1].apply : '-'}/
                          {status.length > 0 ? status[1].limit : '-'}
                        </span>
                      </div>
                      <div className={styles.Modal_grade}>3학년</div>
                      <div>
                        <span className={styles.Modal_count}>
                          {status.length > 0 ? status[2].apply : '-'}/
                          {status.length > 0 ? status[2].limit : '-'}
                        </span>
                      </div>
                      <div className={styles.Modal_grade}>4학년</div>
                      <div>
                        <span className={styles.Modal_count}>
                          {status.length > 0 ? status[3].apply : '-'}/
                          {status.length > 0 ? status[3].limit : '-'}
                        </span>
                      </div>
                      <div className={styles.Modal_grade}>교환학생</div>
                      <div>
                        <span className={styles.Modal_count}>
                          {status.length > 0 ? status[4].apply : '-'}/
                          {status.length > 0 ? status[4].limit : '-'}
                        </span>
                      </div>
                      <div className={styles.Modal_grade}>대학원생</div>
                      <div>
                        <span className={styles.Modal_count}>
                          {' '}
                          {status.length > 0 ? status[5].apply : '-'}/
                          {status.length > 0 ? status[5].limit : '-'}
                        </span>
                      </div>
                    </div>
                    <div className={styles.total}>
                      <div className={styles.Modal_grade_total}>전체</div>
                      <span className={styles.Modal_count}>
                        {status.length > 0 ? status[6].apply : '-'}/
                        {/* {status.length > 0 ? String(Number(status[6].apply)-Number(status[4].apply)-Number(status[5].apply)) : '-'}/ */}
                        {status.length > 0
                          ? status[6].limit.indexOf('+') !== -1
                            ? String(
                                Number(status[6].limit.split('+')[0])
                                +
                                Number(status[6].limit.split('+')[1])
                              )
                            : status[6].limit
                          : '-'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </React.Fragment>,
        document.body,
      )
    : null;
};

export default MagamModal;
