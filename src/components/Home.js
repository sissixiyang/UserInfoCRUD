import React from "react";
import { connect } from "react-redux";
import Button from "@material-ui/core/Button";
import RefreshIcon from "@material-ui/icons/Refresh";
import PersonAddOutlinedIcon from "@material-ui/icons/PersonAddOutlined";
import SearchBar from "./SearchBar";
import SoldierTable from "./SoldierTable";
import "../styles/form.css";
import * as listAction from "../redux/actions/soldierListAction";
import * as scrollAction from "../redux/actions/scrollerAction";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = { resetOnCurrentPage: 0 }; //keys to control reset button on current page
  }

  handleReset = () => {
    this.setState({ resetOnCurrentPage: this.state.resetOnCurrentPage + 1 });
    this.props.setScrollTop(0);
    this.props.setPageNum(0);
    this.props.clearSoldierList();
    this.props.setQuery("");
    this.props.setSortBy("noSort");
    this.props.setDirection(0);
    this.props.setCurrentMode(0);
    this.props.setLoadMoreSubordinates(() => {});
    this.props.setHasMore(true);
  };

  goToCreateSoldierPage = () => {
    this.props.history.push("/createSoldier");
  };

  render() {
    return (
      // <div className="Wrapper">
      //   <div className="operation">
      //     <div>
      //       <SearchBar />
      //     </div>
      //     <div className="buttons">
      //       <div>
      //         <Button
      //           variant="contained"
      //           color="green"
      //           style={{ paddingLeft: 13 }}
      //           startIcon={<RefreshIcon />}
      //           onClick={this.handleReset}
      //         >
      //           Reset
      //         </Button>
      //         <Button
      //           variant="contained"
      //           color="green"
      //           style={{ paddingLeft: 13 }}
      //           startIcon={<PersonAddOutlinedIcon />}
      //           onClick={this.goToCreateSoldierPage}
      //         >
      //           New Soldier
      //         </Button>
      //       </div>
      //     </div>
      //   </div>
      //   <div className="tableWrapper">
      //     <SoldierTable
      //       key={this.state.resetOnCurrentPage}
      //       history={this.props.history}
      //     />
      //   </div>
      // </div>
      <div className="home"> 
      <SearchBar />
      <div className="ButtonStyle">
      <button type="button" className="btn btn-outline-secondary btn-lg" onClick={this.goToCreateSoldierPage}>
                    <span className="glyphicon glyphicon-user"></span> Add Soldier
                </button>
                <button type="button" className="btn btn-outline-secondary btn-lg" onClick={this.handleReset}>Reset</button>
                </div>
                <SoldierTable key={this.state.resetOnCurrentPage} history={this.props.history}
          />
       
       </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    currentMode: state.scrollReducer.currentMode,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setQuery: (query) => {
      dispatch(listAction.setQuery(query));
    },
    setSortBy: (sortBy) => {
      dispatch(listAction.setSortBy(sortBy));
    },
    setPageNum: (pageNum) => {
      dispatch(listAction.setPageNum(pageNum));
    },
    setDirection: (direction) => {
      dispatch(listAction.setDirection(direction));
    },
    setHasMore: (hasMore) => {
      dispatch(scrollAction.setHasMore(hasMore));
    },
    setCurrentMode: (currentMode) => {
      dispatch(scrollAction.setCurrentMode(currentMode));
    },
    setLoadMoreSubordinates: (func) => {
      dispatch(scrollAction.setLoadFunc(func));
    },
    setScrollTop: (scrollTop) => {
      dispatch(scrollAction.setScrollTop(scrollTop));
    },
    clearSoldierList: () => {
      dispatch(listAction.clearSoldierList());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
