import React, { createContext, useState } from 'react';

export const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [paymentInfo, setPaymentInfo] = useState({});

  return (
    <StoreContext.Provider value={{ products, setProducts, cart, setCart, paymentInfo, setPaymentInfo }}>
      {children}
    </StoreContext.Provider>
  );
};
