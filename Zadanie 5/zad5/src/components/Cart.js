import React, { useContext } from 'react';
import { StoreContext } from '../context/StoreContext';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { cart, setCart } = useContext(StoreContext);
    const navigate = useNavigate();

  const removeFromCart = (index) => {
    const newCart = cart.filter((item, idx) => idx !== index);
    setCart(newCart);
  };

  const handleCheckout = () => {
    navigate('/payments');
  };

  return (
    <div>
      <h1>Koszyk</h1>
      {cart && cart.length > 0 ? (
        <div>
          <ul>
            {cart.map((item, index) => (
              <li key={index}>
                {item.name} - {item.price} zł{' '}
                <button onClick={() => removeFromCart(index)}>Usuń</button>
              </li>
            ))}
          </ul>
          <button onClick={handleCheckout}>Przejdź do zamówienia</button>
        </div>
      ) : (
        <p>Koszyk jest pusty.</p>
      )}
    </div>
  );
};

export default Cart;
