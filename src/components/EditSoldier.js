import React from "react";
import { connect } from "react-redux";
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
import * as updateAction from "../redux/actions/updateSoldierAction";
import DateFnsUtils from '@date-io/date-fns/build';
import {
  KeyboardDatePicker, MuiPickersUtilsProvider,
} from '@material-ui/pickers';

import "../styles/form.css";

class EditSoldier extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.currentSoldier.name,
      nameErr: "",
      rank: this.props.currentSoldier.rank,
      sex: this.props.currentSoldier.sex,
      startDate: this.props.currentSoldier.startDate,
      dateErr: "",
      phone: this.props.currentSoldier.phone,
      phoneErr: "",
      email: this.props.currentSoldier.email,
      emailErr: "",
      superior: this.props.currentSoldier.superior,
      superiorId: this.props.currentSoldier.superiorId,
    };
    this.imageRef = React.createRef();
  }

  componentDidMount() {
    console.log(this.props.currentSoldier._id);
    this.props.getCurrentSuperiorList(this.props.currentSoldier._id);
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
        nameErr: "Number not allowed",
      });
    } else {
      this.setState({ ...this.state, name: e.target.value, nameErr: "" });
    }
  };

  handleSexInput = (e) => {
    this.setState({ ...this.state, sex: e.target.value });
  };

  handleDateInput = (e) => {
    if (!e.target.value) {
      this.setState({ ...this.state, startDate: e.target.value, dateErr: "" });
      return;
    }
    const regex = /^(0?[1-9]|1[0-2])\/(0?[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/;
    if (!regex.test(e.target.value)) {
      this.setState({
        ...this.state,
        startDate: e.target.value,
        dateErr: "Format: MM/DD/YYYY",
      });
    } else {
      this.setState({ ...this.state, startDate: e.target.value, dateErr: "" });
    }
  };

  handlePhoneInput = (e) => {
    if (!e.target.value) {
      this.setState({ ...this.state, phone: e.target.value, phoneErr: "" });
      return;
    }
    const regex = /^\d{3}-\d{3}-\d{4}$/;
    if (!regex.test(e.target.value)) {
      this.setState({
        ...this.state,
        phone: e.target.value,
        phoneErr: "Format: ddd-ddd-dddd",
      });
    } else {
      this.setState({ ...this.state, phone: e.target.value, phoneErr: "" });
    }
  };

  handleEmailInput = (e) => {
    if (!e.target.value) {
      this.setState({ ...this.state, email: e.target.value, emailErr: "" });
      return;
    }
    const regex = /^\w+@army\.mil/;
    if (!regex.test(e.target.value)) {
      this.setState({
        ...this.state,
        email: e.target.value,
        emailErr: "Format: xxx@army.mil",
      });
    } else {
      this.setState({ ...this.state, email: e.target.value, emailErr: "" });
    }
  };

  handleSuperiorChange = (e) => {
    console.log(e.target.value);
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

  handleSave = () => {
    const id = this.props.currentSoldier._id;
    if (this.imageRef.current.files[0]) {
      let formData = new FormData();
      formData.append("file", this.imageRef.current.files[0]);
      const imageUrl = `/images/${new Date().getTime()}.jpg`;
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
      };
      if (superior) {
        newSoldier.superior = superior;
        newSoldier.superiorId = superiorId;
      }
      this.props.updateSoldier(newSoldier, id, this.props.history, formData);
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
      };
      if (superior) {
        newSoldier.superior = superior;
        newSoldier.superiorId = superiorId;
      }
      this.props.updateSoldier(newSoldier, id, this.props.history);
    }
  };
  handleDateChange=(e,date)=>{
this.setState({
  startDate:date
})
  }

  render() {
    const {
      name,
      nameErr,
      sex,
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
      startDate &&
      !dateErr &&
      phone &&
      !phoneErr &&
      email &&
      !emailErr;
    console.log(this.state);

    return (
      <div className="container">
        <div className="buttons">
          <div>
         
            <Button color="primary" onClick={this.handleCancel}>
              Cancel
            </Button>
            <Button
              color="primary"
              disabled={!validation}
              onClick={this.handleSave}
              //type="submit"
            >
              Save
            </Button>
          </div>
        </div>
        <div className="form-all">
          <div className="form-left">
            <h2>Avatar</h2>
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
          <div className="form-right">
            <TextField
              error={this.state.nameErr}
              className="item"
              id="standard-basic"
              label="Name"
             // variant="outlined"
              value={this.state.name}
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
                value={this.state.sex}
                onChange={this.handleSexInput}
                className="radio-group"
              >
                <FormControlLabel
                  value="F"
                  control={<Radio />}
                  label="Female"
                />
                <FormControlLabel value="M" control={<Radio />} label="Male" />
              </RadioGroup>
            </FormControl>
            <br />
            {/* <TextField
              id="standard-basic"
              label="Start Date"
              value={this.state.startDate}
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
          label="Date picker inline"
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
              value={this.state.phone}
              onChange={this.handlePhoneInput}
              error={this.state.phoneErr}
            />
            <br />
            <TextField
              id="standard-basic"
              label="Email"
              value={this.state.email}
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
    );
  }
}

const mapStateToProps = (state) => {
  return {
    superiorList: state.currentSoldierReducer.superiorList,
    isCreating: state.currentSoldierReducer.isUpdating,
    url: state.currentSoldierReducer.avatarUrl,
    currentSoldier: state.currentSoldierReducer.currentSoldier,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateSoldier: (soldier, id, history, formData = null) => {
      dispatch(updateAction.updateSoldier(soldier, id, history, formData));
    },
    getCurrentSuperiorList: (id) => {
      dispatch(updateAction.getCurrentSuperiorList(id));
    },
    setImage: (image) => {
      dispatch(updateAction.setImage(image));
    },
    setAvatarUrl: (url) => {
      dispatch(updateAction.setAvatarUrl(url));
    },
    setCurrentSoldier: (soldier) => {
      dispatch(updateAction.setCurrentSoldier(soldier));
    },
    restoreState: () => {
      dispatch(updateAction.restoreState());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditSoldier);
