import React, { useState, useContext } from 'react';
import { StoreContext } from '../context/StoreContext';

const Payments = () => {
  const { cart } = useContext(StoreContext);
  const [form, setForm] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Płatność w toku...'+ JSON.stringify({ payment: form, cart }));
  };

  return (
    <div>
      <h1>Płatności</h1>
      <h2>Do zapłacenia: {cart.map(x => x.price).reduce((x, y) => {console.log(x, y); return x + y;}, 0)}zł</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Numer karty:</label>
          <input 
            type="text" 
            name="cardNumber" 
            value={form.cardNumber} 
            onChange={handleInputChange} 
            required 
          />
        </div>
        <div>
          <label>Imię i nazwisko:</label>
          <input 
            type="text" 
            name="cardHolder" 
            value={form.cardHolder} 
            onChange={handleInputChange} 
            required 
          />
        </div>
        <div>
          <label>Data ważności:</label>
          <input 
            type="text" 
            name="expiryDate" 
            placeholder="MM/YY" 
            value={form.expiryDate} 
            onChange={handleInputChange} 
            required 
          />
        </div>
        <div>
          <label>CVV:</label>
          <input 
            type="text" 
            name="cvv" 
            value={form.cvv} 
            onChange={handleInputChange} 
            required 
          />
        </div>
        <button type="submit">Opłać</button>
      </form>
    </div>
  );
};

export default Payments;
