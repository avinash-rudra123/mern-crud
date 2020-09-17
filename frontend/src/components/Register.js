import React, { Component } from "react";
import { register } from "./User";
class Register extends Component {
  constructor() {
    super();
    this.state = {
      userName: "",
      email: "",
      password: "",
      confirm_password: "",
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  onSubmit = (e) => {
    e.preventDefault();
    const newUser = {
      userName: this.state.userName,
      email: this.state.email,
      password: this.state.password,
      confirm_password: this.state.confirm_password,
    };
    console.log(newUser);

    register(newUser).then((res) => {
      this.props.history.push(`/login`);
    });
  };
  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-6 mt-5 mx-auto">
            <form noValidate onSubmit={this.onSubmit}>
              <h1 className="h3 mb-3 font-weight-normal">Register</h1>
              <div className="form-group">
                <label htmlFor="name">username</label>
                <input
                  type="text"
                  className="form-control"
                  name="userName"
                  placeholder="Enter your first name"
                  value={this.state.userName}
                  onChange={this.onChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email address</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  placeholder="Enter email"
                  value={this.state.email}
                  onChange={this.onChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  placeholder="Password"
                  value={this.state.password}
                  onChange={this.onChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Confirm_password</label>
                <input
                  type="password"
                  className="form-control"
                  name="confirm_password"
                  placeholder="Confirm_password"
                  value={this.state.confirm_password}
                  onChange={this.onChange}
                />
              </div>
              <button
                type="submit"
                className="btn btn-lg btn-primary btn-block"
              >
                Sign Up
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}
export default Register;
