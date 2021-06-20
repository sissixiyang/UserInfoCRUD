import React from "react";
import { Link } from "react-router-dom";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableFooter from "@material-ui/core/TableFooter";
import Paper from "@material-ui/core/Paper";
//import EditIcon from "@material-ui/icons/Edit";
import Button from "@material-ui/core/Button";
import RefreshIcon from "@material-ui/icons/Refresh";
//import HighlightOffIcon from "@material-ui/icons/HighlightOff";
// import "bootstrap/dist/css/bootstrap.min.css"
import PersonAddOutlinedIcon from "@material-ui/icons/PersonAddOutlined";
import { RiDeleteBin6Line } from "react-icons/all";
// import ArrowDropUpIcon  from "@material-ui/icons/ArrowUpwardRounded";
// import ArrowDropDownIcon from "@material-ui/icons/ArrowDownwardRounded";
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import "../styles/SoldierTable.css";

import InfiniteScroll from "react-infinite-scroller";
import { connect } from "react-redux";
import * as tableAction from "../redux/actions/soldierListAction";
import * as scrollAction from "../redux/actions/scrollerAction";
import * as updateAction from "../redux/actions/updateSoldierAction";
import { setCreated } from "../redux/actions/createSoldierAction";
import soldierListReducer from "../redux/reducers/soldierListReducer";

class SoldierTable extends React.Component {
  constructor(props) {
    super(props);
    // this.state={
    //   // soldierList:[
    //   //   {
    //   //     email: "111@qq.com",
    //   //   //  imageUrl: "/images/1623042326157.jpg",
    //   //     name: "jjjj",
    //   //     phone: "123-123-1234",
    //   //     rank: "General",
    //   //     sex: "F",
    //   //     startDate: "09/02/2022",
    //   //   }
    //   // ]
       
    // }
    //mode 0 is soldierList ------ mode 1 is direct subordinates ------ mode 2 is one superior.
    this.scrollParentRef = React.createRef();
    this.scrollRef = React.createRef();
    this.superiorScrollRef = React.createRef();
    this.pageStart = this.props.pageNum;
  }

  componentDidMount() {
    if (this.props.created) {
      this.props.setCreated(false);
      this.props.fetchAllData(this.scrollParentRef);
      this.props.setHasMore(false);
      return;
    }

    if (this.props.currentMode === 0) {
      this.props.fetchAccData(
        this.pageStart,
        this.props.query,
        this.props.sortBy,
        this.props.direction,
        this.scrollParentRef,
        this.props.scrollTop
      );
    } else if (this.props.currentMode === 1) {
      this.props.fetchAccSubordinatesData(
        this.props.lastSoldier._id,
        this.pageStart,
        this.props.query,
        this.props.sortBy,
        this.props.direction,
        this.scrollParentRef,
        this.props.scrollTop
      );
    } else {
      this.handleClickSuperior(this.props.lastSoldier);
    }
  }

  componentWillUnmount() {
    this.props.clearSoldierList();
    this.props.setHasMore(true);
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (
      nextProps.query !== this.props.query ||
      nextProps.sortBy !== this.props.sortBy ||
      nextProps.direction !== this.props.direction
    ) {
      this.props.setHasMore(true);
      if (nextProps.currentMode === 0) {
        this.props.clearSoldierList();
        this.props.fetchData(
          0,
          nextProps.query,
          nextProps.sortBy,
          nextProps.direction
        );
        this.scrollRef.current.pageLoaded = 0;
      } else if (this.props.currentMode === 1) {
        this.props.clearSoldierList();
        this.props.fetchSubordinatesData(
          this.props.lastSoldier._id,
          0,
          nextProps.query,
          nextProps.sortBy,
          nextProps.direction
        );
        this.superiorScrollRef.current.pageLoaded = 0;
      }
    }
  }

  handleSorting = (group) => {
    if (this.props.sortBy === "noSort") {
      this.props.setSortBy(group);
      this.props.setDirection(1);
    } else {
      if (this.props.sortBy !== group) {
        this.props.setSortBy(group);
        this.props.setDirection(1);
      } else {
        if (this.props.direction === -1) {
          this.props.setSortBy("noSort");
          this.props.setDirection(0);
        } else {
          this.props.setDirection(-1);
        }
      }
    }
  };

  handleClickDs = (soldier) => {
    this.props.clearSoldierList();
    this.props.fetchSubordinatesData(soldier._id, 0, "", "noSort", 0);
    this.props.setLastSoldier(soldier);
    this.props.setPageNum(0);
    this.props.setScrollTop(0);
    this.props.setHasMore(true);
    this.props.setCurrentMode(1);
    this.props.setQuery("");
    this.pageStart = 0;
  };

  loadMoreSubordinates = (page) => {
    if (!this.props.isFetching && !this.props.isDeleting) {
      this.props.fetchSubordinatesData(
        this.props.lastSoldier._id,
        page,
        this.props.query,
        this.props.sortBy,
        this.props.direction
      );
    } else {
      this.superiorScrollRef.current.pageLoaded--;
    }
  };

  loadMoreSoldier = (page) => {
    if (!this.props.isFetching && !this.props.isDeleting) {
      this.props.fetchData(
        page,
        this.props.query,
        this.props.sortBy,
        this.props.direction
      );
    } else {
      this.scrollRef.current.pageLoaded--;
    }
  };

  handleClickSuperior = (soldier) => {
    this.props.setLastSoldier(soldier);
    this.props.setQuery("");
    this.props.clearSoldierList();
    this.props.setHasMore(true);
    this.props.setCurrentMode(2);
    this.props.getSuperior(soldier.superiorId);
  };

  handleDelete = (id) => {
    if (this.props.currentMode === 0) {
      this.props.deleteSoldier(
        id,
        this.props.pageNum,
        this.props.query,
        this.props.sortBy,
        this.props.direction,
        this.scrollParentRef,
        this.props.scrollTop,
        this.props.currentMode
      );
    } else if (this.props.currentMode === 1) {
      this.props.deleteSoldier(
        id,
        this.props.pageNum,
        this.props.query,
        this.props.sortBy,
        this.props.direction,
        this.scrollParentRef,
        this.props.scrollTop,
        this.props.currentMode,
        this.props.lastSoldier._id
      );
    } else {
      this.props.deleteSoldier(
        id,
        this.props.pageNum,
        this.props.query,
        this.props.sortBy,
        this.props.direction,
        this.scrollParentRef,
        this.props.scrollTop,
        this.props.currentMode
      );
      this.props.setScrollTop(0);
      this.props.setHasMore(true);
      this.props.setCurrentMode(0);
      this.props.setQuery("");
    }
  };

  goToEditPage = (soldier) => {
    this.props.setCurrentSoldier(soldier);
    this.props.setAvatarUrl(soldier.imageUrl);
    this.props.history.push("/editSoldier");
  };

  render() {
    return (
      <div style={{width:1220}}>
        <TableContainer
        // component={Paper} 
        className="soldierTable">
          <TableHead>
            <TableRow className="a">
              <TableCell id="avatarHeader"className="tableHeaderAvatar" 
          
                 >Avatar</TableCell>
              <TableCell
          
                 onClick={() => this.handleSorting("name")}
                 className="tableHeaderName"
              >
                Name
                {this.props.sortBy === "name" && this.props.direction === 1 && (
                  <ArrowDropUpIcon  />
                )}
                {this.props.sortBy === "name" &&
                  this.props.direction === -1 && <ArrowDropDownIcon />}
              </TableCell>
              <TableCell
          
                className="tableHeader"
                onClick={() => this.handleSorting("sex")}
                id="sexHeader"
              >
                Sex
                {this.props.sortBy === "sex" && this.props.direction === 1 && (
                  <ArrowDropUpIcon  />
                )}
                {this.props.sortBy === "sex" && this.props.direction === -1 && (
                  <ArrowDropDownIcon />
                )}
              </TableCell>
              <TableCell
          
                className="tableHeader"
                onClick={() => this.handleSorting("rank")}
              >
                Rank
                {this.props.sortBy === "rank" && this.props.direction === 1 && (
                  <ArrowDropUpIcon  />
                )}
                {this.props.sortBy === "rank" &&
                  this.props.direction === -1 && <ArrowDropDownIcon />}
              </TableCell>

              <TableCell
          
                className="tableHeaderDate"
                onClick={() => this.handleSorting("startDate")}
              >
                Start Date
                {this.props.sortBy === "startDate" &&
                  this.props.direction === 1 && <ArrowDropUpIcon  />}
                {this.props.sortBy === "startDate" &&
                  this.props.direction === -1 && <ArrowDropDownIcon />}
              </TableCell>
              <TableCell
          
                className="tableHeaderPhone"
                onClick={() => this.handleSorting("phone")}
              >
                Phone
                {this.props.sortBy === "phone" &&
                  this.props.direction === 1 && <ArrowDropUpIcon  />}
                {this.props.sortBy === "phone" &&
                  this.props.direction === -1 && <ArrowDropDownIcon />}
              </TableCell>
              <TableCell
          
                className="tableHeaderEmail"
                onClick={() => this.handleSorting("email")}
              >
                Email
                {this.props.sortBy === "email" &&
                  this.props.direction === 1 && <ArrowDropUpIcon  />}
                {this.props.sortBy === "email" &&
                  this.props.direction === -1 && <ArrowDropDownIcon />}
              </TableCell>
              <TableCell
          
                className="tableHeader"
                onClick={() => this.handleSorting("superior")}
              >
                Superior
                {this.props.sortBy === "superior" &&
                  this.props.direction === 1 && <ArrowDropUpIcon  />}
                {this.props.sortBy === "superior" &&
                  this.props.direction === -1 && <ArrowDropDownIcon />}
              </TableCell>
              <TableCell
          
                className="tableHeader"
                onClick={() => this.handleSorting("ds")}
                id="dsHeader"
              >
                # of D.S.
                {this.props.sortBy === "ds" && this.props.direction === 1 && (
                  <ArrowDropUpIcon  />
                  
                )}
                {this.props.sortBy === "ds" && this.props.direction === -1 && (
                  <ArrowDropDownIcon />
                )}
              </TableCell>
              <TableCell className="tableHeaderAction" id="editHeader">
              Edit
              </TableCell>
              <TableCell className="tableHeaderAction" id="deleteHeader">
              Delete
              </TableCell>
            </TableRow>
          </TableHead>
       
      
        </TableContainer>

        <div
          className="scrollWrapper"
          id="scrollWrapper"
          ref={this.scrollParentRef}
          scrolltop={this.props.scrollTop}
          onScroll={() =>
            this.props.setScrollTop(this.scrollParentRef.current.scrollTop)
          }
        >
          <table>
            {this.props.currentMode === 0 && (
              <InfiniteScroll
                pageStart={this.pageStart}
                initialLoad={false}
                hasMore={this.props.hasMore}
                loadMore={this.loadMoreSoldier}
                threshold={10}
                element={"tbody"}
                useWindow={false}
                getScrollParent={() => this.scrollParentRef.current}
                ref={this.scrollRef}
              >
                   {this.props.soldierList.map((soldier) => {
                {/* {this.props.soldierList.map((soldier) => { */}
                  return (
                    <TableRow className="dataRow" key={soldier._id}>
                      <TableCell className="tableHeader" id="avatarData">
                        <img className="avatar" src={soldier.imageUrl} />
                      </TableCell>
                      <TableCell className="tableHeader">
                        {soldier.name}
                      </TableCell>
                      <TableCell className="tableHeader" id="sexData">
                        {soldier.sex}
                      </TableCell>
                      <TableCell className="tableHeader">
                        {soldier.rank}
                      </TableCell>
                      <TableCell className="tableHeaderDate">
                        {soldier.startDate}
                      </TableCell>
                      <TableCell className="tableHeaderPhone">
                        <a href={`tel:${soldier.phone}`} target="_blank">
                          {soldier.phone}
                        </a>
                      </TableCell>
                      <TableCell className="tableHeaderEmail">
                        <a href={`mailto:${soldier.email}`} target="_blank">
                          {soldier.email}
                        </a>
                      </TableCell>
                      <TableCell
                        className="tableHeader"
                        onClick={() => this.handleClickSuperior(soldier)}
                      >
                        {soldier.superior}
                      </TableCell>
                      <TableCell
                        className="tableHeader"
                        id="dsData"
                        onClick={() => this.handleClickDs(soldier)}
                      >
                        {soldier.ds > 0 && soldier.ds}
                      </TableCell>
                      <TableCell className="tableHeader" id="editData"
                          
                          >
                            <span style={{cursor:'pointer'}} onClick={() => this.goToEditPage(soldier)}>EDIT</span>
                        {/* <Button
                          // variant="contained"
                          // color="primary"
                          // startIcon={<EditIcon />}
                          onClick={() => this.goToEditPage(soldier)}

                        > */}
                           {/* <span className="glyphicon glyphicon-pencil"></span> */}
                        {/* </Button> */}
                      </TableCell>
                      <TableCell className="tableHeader" id="deleteData">
                      <span style={{cursor:'pointer'}}  onClick={() => this.handleDelete(soldier._id)}>DELETE</span>

                        {/* <Button
                          // variant="contained"
                          // color="primary"
                          // startIcon={<HighlightOffIcon />}
                          type="button" className="btn btn-default"
                          onClick={() => this.handleDelete(soldier._id)}
                        ><span className="glyphicon glyphicon-remove"></span>Delete</Button> */}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </InfiniteScroll>
            )}

            {this.props.currentMode === 1 && (
              <InfiniteScroll
                pageStart={this.pageStart}
                initialLoad={false}
                hasMore={this.props.hasMore}
                loadMore={this.loadMoreSubordinates}
                threshold={10}
                element={"tbody"}
                useWindow={false}
                getScrollParent={() => this.scrollParentRef.current}
                ref={this.superiorScrollRef}
              >
                   {this.props.soldierList.map((soldier) => {
                {/* {this.props.soldierList.map((soldier) => { */}
                  return (
                    <TableRow className="dataRow" key={soldier._id}>
                      <TableCell className="tableHeader" id="avatarData">
                        <img className="avatar" src={soldier.imageUrl} />
                      </TableCell>
                      <TableCell className="tableHeader">
                        {soldier.name}
                      </TableCell>
                      <TableCell className="tableHeader" id="sexData">
                        {soldier.sex}
                      </TableCell>
                      <TableCell className="tableHeader">
                        {soldier.rank}
                      </TableCell>
                      <TableCell className="tableHeaderDate">
                        {soldier.startDate}
                      </TableCell>
                      <TableCell className="tableHeaderPhone">
                        <a href={`tel:${soldier.phone}`} target="_blank">
                          {soldier.phone}
                        </a>
                      </TableCell>
                      <TableCell className="tableHeaderEmail">
                        <a href={`mailto:${soldier.email}`} target="_blank">
                          {soldier.email}
                        </a>
                      </TableCell>
                      <TableCell
                        className="tableHeader"
                        onClick={() => this.handleClickSuperior(soldier)}
                      >
                        {soldier.superior}
                      </TableCell>
                      <TableCell
                        className="tableHeader"
                        id="dsData"
                        onClick={() => this.handleClickDs(soldier)}
                      >
                        {soldier.ds > 0 && soldier.ds}
                      </TableCell>
                      <TableCell className="tableHeader" id="editData">
                      <span style={{cursor:'pointer'}} onClick={() => this.goToEditPage(soldier)}>EDIT</span>

                      </TableCell>
                      <TableCell className="tableHeader" id="deleteData">
                      <span style={{cursor:'pointer'}}  onClick={() => this.handleDelete(soldier._id)}>DELETE</span>

                        {/* <Button
                          // variant="contained"
                          // color="primary"
                          // startIcon={<HighlightOffIcon />}
                          type="button" className="btn btn-default" 
                          onClick={() => this.handleDelete(soldier._id)}
                        ><span className="glyphicon glyphicon-remove"></span>Delete</Button> */}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </InfiniteScroll>
            )}

            {this.props.currentMode === 2 &&
            this.props.soldierList.map((soldier) => {
              // this.props.soldierList.map((soldier) => {
                return (
                  <tbody>
                    <TableRow className="dataRow" key={soldier._id}>
                      <TableCell className="tableHeader" id="avatarData">
                        <img className="avatar" src={soldier.imageUrl} />
                      </TableCell>
                      <TableCell className="tableHeader">
                        {soldier.name}
                      </TableCell>
                      <TableCell className="tableHeader" id="sexData">
                        {soldier.sex}
                      </TableCell>
                      <TableCell className="tableHeader">
                        {soldier.rank}
                      </TableCell>
                      <TableCell className="tableHeaderDate">
                        {soldier.startDate}
                      </TableCell>
                      <TableCell className="tableHeaderPhone">
                        <a href={`tel:${soldier.phone}`} target="_blank">
                          {soldier.phone}
                        </a>
                      </TableCell>
                      <TableCell className="tableHeaderEmail">
                        <a href={`mailto:${soldier.email}`} target="_blank">
                          {soldier.email}
                        </a>
                      </TableCell>
                      <TableCell
                        className="tableHeader"
                        onClick={() => this.handleClickSuperior(soldier)}
                      >
                        {soldier.superior}
                      </TableCell>
                      <TableCell
                        className="tableHeader"
                        id="dsData"
                        onClick={() => this.handleClickDs(soldier)}
                      >
                        {soldier.ds > 0 && soldier.ds}
                      </TableCell>
                      <TableCell className="tableHeader" id="editData">
                      <span style={{cursor:'pointer'}} onClick={() => this.goToEditPage(soldier)}>EDIT</span>

                      </TableCell>
                      <TableCell className="tableHeader" id="deleteData">
                        {/* <Button
                          // variant="contained"
                          // color="primary"
                          // startIcon={<HighlightOffIcon />}
                          type="button" className="btn btn-default" 
                          onClick={() => this.handleDelete(soldier._id)}
                        ><span className="glyphicon glyphicon-remove"></span> Delete</Button> */}
                                              <span style={{cursor:'pointer'}}  onClick={() => this.handleDelete(soldier._id)}>DELETE</span>

                      </TableCell>
                    </TableRow>
                  </tbody>
                );
              })}
          </table>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    soldierList: state.soldierListReducer.soldierList,
    isFetching: state.soldierListReducer.isFetching,
    isDeleting: state.soldierListReducer.isDeleting,
    query: state.soldierListReducer.query,
    sortBy: state.soldierListReducer.sortBy,
    pageNum: state.soldierListReducer.pageNum,
    direction: state.soldierListReducer.direction,
    hasMore: state.soldierListReducer.hasMore,
    currentMode: state.scrollReducer.currentMode,
    scrollTop: state.scrollReducer.scrollTop,
    lastSoldier: state.scrollReducer.lastSoldier,
    created: state.newSoldierReducer.created,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setQuery: (query) => {
      dispatch(tableAction.setQuery(query));
    },
    fetchData: (pageNum, query, sortBy, direction) => {
      dispatch(tableAction.fetchData(pageNum, query, sortBy, direction));
    },
    fetchAccData: (
      pageNum,
      query,
      sortBy,
      direction,
      scrollElement,
      scrollTop
    ) => {
      dispatch(
        tableAction.fetchAccData(
          pageNum,
          query,
          sortBy,
          direction,
          scrollElement,
          scrollTop
        )
      );
    },
    fetchSubordinatesData: (id, pageNum, query, sortBy, direction) => {
      dispatch(
        tableAction.fetchSubordinatesData(id, pageNum, query, sortBy, direction)
      );
    },
    fetchAccSubordinatesData: (
      id,
      pageNum,
      query,
      sortBy,
      direction,
      scrollElement,
      scrollTop
    ) => {
      dispatch(
        tableAction.fetchAccSubordinatesData(
          id,
          pageNum,
          query,
          sortBy,
          direction,
          scrollElement,
          scrollTop
        )
      );
    },
    deleteSoldier: (
      id,
      pageNum,
      query,
      sortBy,
      direction,
      scrollElement,
      scrollTop,
      mode = 0,
      lastSoldierId
    ) => {
      dispatch(
        tableAction.deleteSoldier(
          id,
          pageNum,
          query,
          sortBy,
          direction,
          scrollElement,
          scrollTop,
          mode,
          lastSoldierId
        )
      );
    },
    clearSoldierList: () => {
      dispatch(tableAction.clearSoldierList());
    },
    getSuperior: (id) => {
      dispatch(tableAction.getSuperior(id));
    },
    setSortBy: (sortBy) => {
      dispatch(tableAction.setSortBy(sortBy));
    },
    setDirection: (direction) => {
      dispatch(tableAction.setDirection(direction));
    },
    setPageNum: (pageNum) => {
      dispatch(tableAction.setPageNum(pageNum));
    },
    setHasMore: (hasMore) => {
      dispatch(scrollAction.setHasMore(hasMore));
    },
    setCurrentMode: (currentMode) => {
      dispatch(scrollAction.setCurrentMode(currentMode));
    },
    setCurrentSoldier: (soldier) => {
      dispatch(updateAction.setCurrentSoldier(soldier));
    },
    setAvatarUrl: (url) => {
      dispatch(updateAction.setAvatarUrl(url));
    },
    setScrollTop: (scrollTop) => {
      dispatch(scrollAction.setScrollTop(scrollTop));
    },
    setLastSoldier: (lastSoldier) => {
      dispatch(scrollAction.setLastSoldier(lastSoldier));
    },
    setCreated: (created) => {
      dispatch(setCreated(created));
    },
    fetchAllData: (scrollElement) => {
      dispatch(tableAction.fetchAllData(scrollElement));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SoldierTable);
