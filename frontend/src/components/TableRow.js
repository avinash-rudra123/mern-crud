import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

class TableRow extends Component {
  constructor(props) {
    super(props);
    this.delete = this.delete.bind(this);
  }

  delete() {
    axios
      .delete("http://localhost:3056/api/delete/" + this.props.obj._id)
      .then(console.log("Deleted"))
      .catch((err) => console.log(err));
  }

  render() {
    return (
      <tr>
        <td>{this.props.obj.userName}</td>
        <td>{this.props.obj.email}</td>
        {/* <td>{this.props.obj.password}</td> */}
        <td>
          <Link to={"/edit/" + this.props.obj._id} className="btn btn-primary">
            Edit
          </Link>
        </td>
        <td>
          <button onClick={this.delete} className="btn btn-danger">
            Delete
          </button>
        </td>
        <td></td>
      </tr>
    );
  }
}

export default TableRow;
