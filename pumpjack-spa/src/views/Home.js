import React, { useContext } from "react";
import { Link as RouterLink, withRouter } from 'react-router-dom';
import { Context } from "../store";

const Home = (props) =>
{

  const { store, dispatch } = useContext(Context);

const navTo = (page) => {
//alert(page)
  props.history.push(page);

};


const viewOwned = (id) => {
  navTo('/user/' + id);
};

  return(
    <>
    <div className="container is-fluid">
    <h1 className="title">Users:</h1>
    <table className="table is-fullwidth">
  <thead>
    <tr>
      <th><abbr title="User ID">User ID</abbr></th>
      <th><abbr title="First Name">First Name</abbr></th>
      <th><abbr title="Last Name">Last Name</abbr></th>
      <th><abbr title="Email">Email</abbr></th>
      <th><abbr title="View Owned Products">View Owned Products</abbr></th>
    </tr>
  </thead>
  <tfoot>
  <tr>
  <th><abbr title="User ID">User ID</abbr></th>
  <th><abbr title="First Name">First Name</abbr></th>
  <th><abbr title="Last Name">Last Name</abbr></th>
  <th><abbr title="Email">Email</abbr></th>
  <th><abbr title="View Owned Products">View Owned Products</abbr></th>
</tr>
  </tfoot>
  <tbody>
  { store.users && store.users.length > 0 ?
    store.users.map(user => (
    <tr>
      <th>{user.id}</th>
      <td><strong>{user.first_name}</strong></td>
      <td><strong>{user.last_name}</strong></td>
      <td>{user.email}</td>
      <td><button className="button is-success" onClick={() => viewOwned(user.id)}>View Owned</button></td>
    </tr>
  )) : <tr><th>No Users</th></tr>
}
  </tbody>
</table>
</div>
  </>
  )
};

export default withRouter(Home);
