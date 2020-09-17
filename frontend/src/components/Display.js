import React, { Component } from "react";
import axios from "axios";
import TableRow from "./TableRow";

class Display extends Component {
  constructor(props) {
    super(props);
    this.state = { user: [] };
    //this.tabRow = this.tabRow.bind(this);
  }
  componentDidMount() {
    axios
      .get("http://localhost:3056/api/find")
      .then((response) => {
        this.setState({ user: response.data });
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  tabRow() {
    return this.state.user.map((Object, i) => {
      return <TableRow obj={Object} key={i} />;
    });
  }

  render() {
    return (
      <div>
        <h3 align="center">USER INFORMATION</h3>
        <table className="table table-striped" style={{ marginTop: 20 }}>
          <thead>
            <tr>
              <th>USERNAME</th>
              <th>EMAIL</th>
              {/* <th>PASSWORD</th> */}
            </tr>
          </thead>
          <tbody>{this.tabRow()}</tbody>
        </table>
      </div>
    );
  }
}
export default Display;
