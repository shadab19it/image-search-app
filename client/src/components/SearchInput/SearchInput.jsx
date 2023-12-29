import React from "react";

const SearchInput = ({ onEnterGetData, onChangeQuery, onGetData, searchText }) => {
  return (
    <input className='search-input' placeholder='Search Images' onKeyDown={onEnterGetData} value={searchText} onChange={onChangeQuery} />
  );
};

export default SearchInput;
