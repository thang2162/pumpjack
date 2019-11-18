import React from "react";

export const initialState = {
  users: null,
  products: null
};

export const reducer = (state, action) => {
  switch (action.type) {
    case "reset":
      return initialState;
    case "setUsers":
      return { ...state, users: action.data  };
    case "setProducts":
      return {  ...state, products: action.data};
    case "setAll":
      return {  ...state, products: action.products, users: action.users};
    case "selectUser":
        return {  ...state, selectedUser: action.user_id};
    default:
      //alert(action.cardTxt)
      return state;
  }
};

export const Context = React.createContext();
