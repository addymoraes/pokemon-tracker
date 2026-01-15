import './App.css';
import { useState, useEffect } from 'react';

function App() {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    fetch('/cards')
      .then(response => response.json())
      .then(data => setCards(data))
      .catch(error => console.error('Error fetching cards:', error));
  }, []);

  return (
    <div title>
      <h1>Pokemon Card Tracker</h1>

      {cards.length === 0 ? (
        <p>No cards found</p>
      ) : (
        <ul>
          {cards.map(card => (
            <li key={card.id}>
              <h2>{card.card}</h2>
              <p>Type: {card.type}</p>
              <p>HP: {card.hp}</p>
              <p>Rarity: {card.rarity}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
