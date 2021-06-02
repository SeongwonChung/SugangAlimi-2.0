import React from 'react';
import { MdSearch } from 'react-icons/md';
import styles from '../styles/components/SearchBar.module.css';

function SearchBar({ query, onClick, onChange, onKeyDown }) {
  return (
    <div className={styles.searchbar_wrapper}>
      <input
        className={[styles.search_bar, styles.text].join(' ')}
        value={query}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder="과목명, 학수번호, 교수명으로 검색"
      />
      <button className={styles.search_button} onClick={onClick}>
        <MdSearch className={styles.search_icon} />
      </button>
    </div>
  );
}

export default SearchBar;
