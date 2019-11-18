import React, { useContext } from "react";
import { Link as RouterLink, withRouter } from 'react-router-dom';
import { Context } from "../store";

const Products = (props) =>
{

  const { store, dispatch } = useContext(Context);

const navTo = (page) => {
//alert(page)
  props.history.push(page);

};

  return(
    <>
    <div className="container is-fluid">

    <h1 className="title">Products:</h1>

    <table className="table is-fullwidth">
  <thead>
    <tr>
      <th><abbr title="Product ID">Product ID</abbr></th>
      <th><abbr title="Image">Image</abbr></th>
      <th><abbr title="Name">Name</abbr></th>
      <th><abbr title="Description">Description</abbr></th>
      <th><abbr title="Price">Price</abbr></th>
    </tr>
  </thead>
  <tfoot>
  <tr>
  <th><abbr title="Product ID">Product ID</abbr></th>
  <th><abbr title="Image">Image</abbr></th>
  <th><abbr title="Name">Name</abbr></th>
  <th><abbr title="Description">Description</abbr></th>
  <th><abbr title="Price">Price</abbr></th>
</tr>
  </tfoot>
  <tbody>
  { store.products && store.products.length > 0 ?
    store.products.map(product => (
    <tr>
      <th>{product.id}</th>
      <td>
      {product.image_mime ? <figure className="image is-3by5">
      <img src={`data:${product.image_mime};base64,${product.img_data}`}/>
    </figure> : ''}
    </td>
      <td><strong>{product.name}</strong></td>
      <td>{product.description}</td>
      <td>${product.price}</td>
    </tr>)): <tr><th>No proudcts.</th></tr>}

  </tbody>
</table>
</div>
  </>
  )
};

export default withRouter(Products);
