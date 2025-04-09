import React, { useEffect, useContext } from 'react';
import { StoreContext } from '../context/StoreContext';

const Products = () => {
  const { products, setProducts, cart, setCart } = useContext(StoreContext);

  useEffect(() => {
    fetch('http://localhost:8080/products')
      .then(response => response.json())
      .then(data => setProducts(data))
      .catch(error => console.error('Błąd podczas pobierania produktów:', error));
  }, [setProducts]);

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  return (
    <div>
      <h1>Produkty</h1>
      {products && products.length > 0 ? (
        <ul>
          {products.map((product, idx) => (
            <li key={idx}>
              {product.name} - {product.price} zł{' '}
              <button onClick={() => addToCart(product)}>Dodaj do koszyka</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>Brak produktów.</p>
      )}
    </div>
  );
};

export default Products;
