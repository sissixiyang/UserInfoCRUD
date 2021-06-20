import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormLabel from "@material-ui/core/FormLabel";
import "../styles/form.css";
import "bootstrap/dist/css/bootstrap.min.css"
import DateFnsUtils from '@date-io/date-fns/build';
import {
  KeyboardDatePicker, MuiPickersUtilsProvider,
} from '@material-ui/pickers';

import { connect } from "react-redux";
import * as createAction from "../redux/actions/createSoldierAction";
import * as avatarAction from "../redux/actions/updateSoldierAction";

class CreateSoldier extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      nameErr: false,
      rank: "General",
      sex: "",
      sexErr: false,
      startDate: "",
      dateErr: false,
      phone: "",
      phoneErr: false,
      email: "",
      emailErr: false,
      superior: "",
      superiorId: false,
    };
    this.imageRef = React.createRef();
  }

  componentDidMount() {
    this.props.getSuperiorList();
  }

  componentWillUnmount() {
    this.props.restoreState();
  }

  handleImageChange = (e) => {
    this.props.setAvatarUrl(URL.createObjectURL(e.target.files[0]));
    this.props.setImage(e.target.files[0]);
  };

  handleChange = (e) => {
    this.setState({ ...this.state, [e.target.name]: e.target.value });
  };

  handleNameInput = (e) => {
    const regex = /(?=.*\d)/;
    if (regex.test(e.target.value)) {
      this.setState({
        ...this.state,
        name: e.target.value,
        nameErr: true,
      });
    } else {
      this.setState({ ...this.state, name: e.target.value, nameErr: false });
    }
  };

  handleSexInput = (e) => {
    console.log(e.target.value);
    this.setState({ ...this.state, sex: e.target.value, sexErr: false });
  };

  handleDateInput = (e) => {
    const regex = /^(0?[1-9]|1[0-2])\/(0?[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/;
    if (!regex.test(e.target.value)) {
      this.setState({
        ...this.state,
        startDate: e.target.value,
        dateErr: true,
      });
    } else {
      this.setState({
        ...this.state,
        startDate: e.target.value,
        dateErr: false,
      });
    }
  };

  handlePhoneInput = (e) => {
    const regex = /^\d{3}-\d{3}-\d{4}$/;
    if (!regex.test(e.target.value)) {
      this.setState({
        ...this.state,
        phone: e.target.value,
        phoneErr: true,
      });
    } else {
      this.setState({ ...this.state, phone: e.target.value, phoneErr: false });
    }
  };

  handleEmailInput = (e) => {
    const regex = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;
    if (!regex.test(e.target.value)) {
      this.setState({
        ...this.state,
        email: e.target.value,
        emailErr: true,
      });
    } else {
      this.setState({ ...this.state, email: e.target.value, emailErr: false });
    }
  };

  handleSuperiorChange = (e) => {
    if (!e.target.value) {
      this.setState({ ...this.state, superior: "", superiorId: "" });
    } else {
      this.setState({
        ...this.state,
        superior: e.target.value,
        superiorId: this.props.superiorList[e.target.selectedIndex - 1]._id,
      });
    }
  };

  handleCancel = () => {
    this.props.history.push("/");
  };

  handleDateChange=(e,date)=>{
    this.setState({
      startDate:date
    })
      }
  handleSave = () => {
    if (this.imageRef.current.files[0]) {
      let formData = new FormData();
      formData.append("file", this.imageRef.current.files[0]);
      const imageUrl = `/images/${new Date().getTime()}.jpg`;
      console.log(imageUrl);
      const {
        name,
        rank,
        sex,
        startDate,
        phone,
        email,
        superior,
        superiorId,
      } = this.state;
      const newSoldier = {
        name: `${name}`,
        rank: `${rank}`,
        sex: `${sex}`,
        startDate: `${startDate}`,
        phone: `${phone}`,
        email: `${email}`,
        imageUrl: imageUrl,
        default: 0,
      };
      if (superior) {
        newSoldier.superior = superior;
        newSoldier.superiorId = superiorId;
      }
      this.props.createSoldier(newSoldier, this.props.history, formData);
    } else {
      const {
        name,
        rank,
        sex,
        startDate,
        phone,
        email,
        superior,
        superiorId,
      } = this.state;
      const newSoldier = {
        name: `${name}`,
        rank: `${rank}`,
        sex: `${sex}`,
        startDate: `${startDate}`,
        phone: `${phone}`,
        email: `${email}`,
        imageUrl: "/images/default.png",
        default: 1,
      };
      if (superior) {
        newSoldier.superior = superior;
        newSoldier.superiorId = superiorId;
      }
      this.props.createSoldier(newSoldier, this.props.history);
    }
  };

  render() {
    const {
      name,
      nameErr,
      sex,
      sexErr,
      startDate,
      dateErr,
      phone,
      phoneErr,
      email,
      emailErr,
    } = this.state;
    const validation =
      name &&
      !nameErr &&
      sex &&
      !sexErr &&
      startDate &&
      !dateErr &&
      phone &&
      !phoneErr &&
      email &&
      !emailErr;

    return (
      <div className="container">
       
        <div className="form-all">
          <div className="left-form">
            <div className="avatarWrapper">
              <h3>Creat New soldier</h3>
              <br />
               <img
                className="avatarImage"
                src={this.props.url}

                alt="Avatar image"
              />
              <br />
              <div className="filePart">
                <input value="Select an image" />
                <input
                  className="upload"
                  type="file"
                  id="avatar"
                  name="avatar"
                  accept="image/png, image/jpeg"
                  onChange={this.handleImageChange}
                  ref={this.imageRef}
                />
              </div>
            </div>
          </div>

          <div className="right-form">
            <div className="Wrapper">
              <TextField
                error={this.state.nameErr}
                className="item"
                id="standard-basic"
                label="Name"
               // variant="outlined"
                onChange={this.handleNameInput}
              />
              <br />
              <FormControl className="aa">
                <InputLabel id="demo-simple-select-label">Rank</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={this.state.rank}
                  onChange={this.handleChange}
                >
                  <MenuItem value={"General"}>General</MenuItem>
                  <MenuItem value={"Colonel"}>Colonel</MenuItem>
                  <MenuItem value={"Major"}>Major</MenuItem>
                  <MenuItem value={"Captain"}>Captain</MenuItem>
                  <MenuItem value={"Lieutenant"}>Lieutenant</MenuItem>
                  <MenuItem value={"Warrant Officer"}>Warrant Officer</MenuItem>
                  <MenuItem value={"Sergeant"}>Sergeant</MenuItem>
                  <MenuItem value={"Corporal"}>Corporal</MenuItem>
                  <MenuItem value={"Specialist"}>Specialist</MenuItem>
                  <MenuItem value={"Private"}>Private</MenuItem>
                </Select>
                <br />

                <FormLabel className="radio-gender" component="legend">
                  Gender
                </FormLabel>
                <RadioGroup
                  aria-label="gender"
                  name="gender1"
                  onChange={this.handleSexInput}
                  className="radio-group"
                >
                  <FormControlLabel
                    value="F"
                    control={<Radio />}
                    label="Female"
                  />
                  <FormControlLabel
                    value="M"
                    control={<Radio />}
                    label="Male"
                  />
                </RadioGroup>
              </FormControl>
              <br />
              {/* <TextField
                id="standard-basic"
                label="Start Date"
                onChange={this.handleDateInput}
                error={this.state.dateErr}
              /> */}
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <KeyboardDatePicker
          disableToolbar
          variant="inline"
          format="MM/dd/yyyy"
          margin="normal"
          id="date-picker-inline"
          //label="Date picker inline"
         value={startDate}
          onChange={this.handleDateChange}
          // KeyboardButtonProps={{
          //   'aria-label': 'change date',
          // }}
        /> 
    </MuiPickersUtilsProvider>
              <br />
              <TextField
                id="standard-basic"
                label="Phone"
                placeholder="111-111-1111"
                onChange={this.handlePhoneInput}
                error={this.state.phoneErr}
              />
              <br />
              <TextField
                id="standard-basic"
                label="Email"
                placeholder="11@aa.com"
                onChange={this.handleEmailInput}
                error={this.state.emailErr}
              />
              <br />
              <label htmlFor="superior">Superior:</label>
              <br />
              <select
                className="dropdown"
                id="superior"
                name="superior"
                value={this.state.superior}
                onChange={this.handleSuperiorChange}
              >
                <option value=""></option>
                {this.props.superiorList.map((superior) => (
                  <option value={superior.name}>{superior.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        {/* <div className="buttons"> */}
        <div
        //className="form-row col-md-6" 
        style={{marginTop:'20px'}}>
          <div 
          //className="col"
          >
            {/* <Button 
            // color="primary"  
          
            type="button" 
            onClick={this.handleCancel}>
              Cancel
            </Button> */}
            <Button variant="contained" color="primary"
              style={{marginRight:20}}
            onClick={this.handleCancel}>
Cancel</Button>
<Button variant="contained" color="primary"
            onClick={this.handleSave}
            disabled={!validation}>
Save</Button>

           </div>
           {/* <div className="col">

            <Button
              // variant="contained"
              // color="primary"
              type="button"
               className="btn btn-primary"
              disabled={!validation}
              onClick={this.handleSave}
              // type="submit"
              // className="save-button"
            >
              Save
            </Button> 
          </div> */}
        </div> 
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    superiorList: state.newSoldierReducer.superiorList,
    isCreating: state.newSoldierReducer.isCreating,
    url: state.currentSoldierReducer.avatarUrl,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    createSoldier: (soldier, history, formData = null) => {
      dispatch(createAction.createNewSoldier(soldier, history, formData));
    },
    getSuperiorList: () => {
      dispatch(createAction.getSuperiorList());
    },
    setImage: (image) => {
      dispatch(avatarAction.setImage(image));
    },
    setAvatarUrl: (url) => {
      dispatch(avatarAction.setAvatarUrl(url));
    },
    setCurrentSoldier: (soldier) => {
      dispatch(avatarAction.setCurrentSoldier(soldier));
    },
    restoreState: () => {
      dispatch(createAction.restoreState());
      dispatch(avatarAction.restoreState());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateSoldier);
