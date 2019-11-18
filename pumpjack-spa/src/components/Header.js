import React from "react";
import OutsideClickHandler from 'react-outside-click-handler';
import { Link as RouterLink, withRouter } from 'react-router-dom';

export default withRouter((props) => {

  const [values, setValues] = React.useState({
    showMenu: false
  });

  const toggleMenu = () => {
    setValues({...values, ['showMenu']: !values.showMenu});
  }

  const navTo = (page) => {
  //alert(page)
    props.history.push(page);

  };

  React.useEffect(() => {
   // Bind the event listener
   //document.addEventListener("mousedown", handleClickOutside);
   return () => {
     // Unbind the event listener on clean up
    // document.removeEventListener("mousedown", handleClickOutside);
   };
 });


  return (
    <OutsideClickHandler
     onOutsideClick={() => {
      // alert('You clicked outside of this component!!!');
      setValues({...values, ['showMenu']: false});
     }}
   >
    <nav className="navbar" role="navigation" aria-label="main navigation">
  <div className="navbar-brand">
  <a className="navbar-item has-text-weight-bold is-family-sans-serif" onClick={() => {navTo('/');}}>
    <span className="has-text-grey">Pump</span><span className="has-text-primary">Jack</span>
  </a>

    <a role="button" className={`navbar-burger burger ${values.showMenu ? 'is-active' : ''}`} aria-label="menu" aria-expanded="false" data-target="navbarBasicExample"
    onClick={() => toggleMenu()}
    >
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
    </a>
  </div>

  <div id="navbarBasicExample" className={`navbar-menu ${values.showMenu ? 'is-active' : ''}`}>
    <div className="navbar-start">
      <a className="navbar-item" onClick={() => navTo('/')}>
        Home
      </a>
      <a className="navbar-item" onClick={() => navTo('/products')}>
        Products
      </a>

    </div>

  </div>
</nav>
</OutsideClickHandler>
  );
});
