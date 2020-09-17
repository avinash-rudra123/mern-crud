import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
class Edit extends Component {
  constructor(props) {
    super(props);
    this.onChangeuserName = this.onChangeuserName.bind(this);
    this.onChangeemail = this.onChangeemail.bind(this);
    this.onChangepassword = this.onChangepassword.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      userName: "",
      email: "",
      password: "",
    };
  }

  componentDidMount() {
    axios
      .post("http://localhost:3056/api/login/" + this.props.match.params.id)
      .then((response) => {
        this.setState({
          userName: response.data.userName,
          email: response.data.email,
          password: response.data.password,
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  onChangeuserName(e) {
    this.setState({
      userName: e.target.value,
    });
  }
  onChangeemail(e) {
    this.setState({
      email: e.target.value,
    });
  }
  onChangepassword(e) {
    this.setState({
      password: e.target.value,
    });
  }

  onSubmit(e) {
    e.preventDefault();
    const user = {
      userName: this.state.userName,
      email: this.state.email,
      password: this.state.password,
    };
    axios
      .put("http://localhost:3056/api/edit/" + this.props.match.params.id, user)
      .then((res) => console.log(res.data));

    this.props.history.push("/find");
  }

  render() {
    return (
      <React.Fragment>
        <h3 align="center">Update Information</h3>
        <form onSubmit={this.onSubmit}>
          <div className="form-group col-sm-4">
            <label>UserName: </label>
            <input
              type="text"
              className="form-control input-sm"
              value={this.state.userName}
              autoFocus
              placeholder="Enter ur UserName"
              onChange={this.onChangeuserName}
            />
          </div>
          <div className="form-group col-sm-4">
            <label>Email: </label>
            <input
              type="email"
              className="form-control"
              value={this.state.email}
              autoFocus
              placeholder="Enter ur email"
              onChange={this.onChangeemail}
            />
            <small id="emailHelp" class="form-text text-muted">
              We'll never share your email with anyone else.
            </small>
          </div>
          <div className="form-group col-sm-4">
            <label>Passsword: </label>
            <input
              type="password"
              autoFocus
              className="form-control"
              placeholder="Enter ur password"
              value={this.state.password}
              onChange={this.onChangepassword}
            />
          </div>
          <input
            type="submit"
            value="Update information"
            className="btn btn-primary"
          />
          <Link to="/find">
            {" "}
            <button
              onClick={this.cancel}
              type="button"
              className="btn btn-light m-3"
            >
              Cancel
            </button>
          </Link>
        </form>
      </React.Fragment>
    );
  }
}
export default Edit;
