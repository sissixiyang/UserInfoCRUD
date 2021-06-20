import React from "react";
import { connect } from "react-redux";
import "../styles/SearchBar.css";
import * as soldierListAction from "../redux/actions/soldierListAction";
import * as scrollAction from "../redux/actions/scrollerAction";

const SearchBar = (props) => {
  const handleInput = (e) => {
    props.setQuery(e.target.value);
  };

  const clearInput = () => {
    props.setQuery("");
    props.setScrollTop(0);
    props.setPageNum(0);
  };

  return (
    <div className='seacrchStyle'>
      <label htmlFor="search"></label>
      <input
        className="searchInput"
        disabled={props.currentMode === 2}
        value={props.query}
        onChange={handleInput}
        id="search"
        type="text"
        placeholder="Search"
      />
      <button
        className="clearButton"
        disabled={!props.query}
        onClick={clearInput}
      >
        x
      </button>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    query: state.soldierListReducer.query,
    currentMode: state.scrollReducer.currentMode,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setQuery: (query) => {
      dispatch(soldierListAction.setQuery(query));
    },
    setScrollTop: (scrollTop) => {
      dispatch(scrollAction.setScrollTop(scrollTop));
    },
    setPageNum: (pageNum) => {
      dispatch(soldierListAction.setPageNum(pageNum));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchBar);
