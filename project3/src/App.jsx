import { useState, useEffect } from 'react';

const EMOJIS = ['🚀', '👾', '🎮', '🧩', '🎸', '🎲', '💎', '🌟'];

function App() {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);

  // Initialize game
  const initializeGame = () => {
    const shuffledCards = [...EMOJIS, ...EMOJIS]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({ id: index, emoji }));
    
    setCards(shuffledCards);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  // Handle card click
  const handleCardClick = (index) => {
    if (flipped.length === 2 || flipped.includes(index) || matched.includes(index)) return;

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      
      const firstIndex = newFlipped[0];
      const secondIndex = newFlipped[1];

      if (cards[firstIndex].emoji === cards[secondIndex].emoji) {
        setMatched((prev) => [...prev, firstIndex, secondIndex]);
        setFlipped([]);
      } else {
        setTimeout(() => {
          setFlipped([]);
        }, 1000);
      }
    }
  };

  const isGameOver = matched.length === cards.length && cards.length > 0;

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-white mb-2 drop-shadow-md">Memory Match</h1>
          <div className="flex justify-between items-center text-white/90 font-medium">
            <span className="bg-black/20 px-4 py-1.5 rounded-full">Moves: {moves}</span>
            <button 
              onClick={initializeGame}
              className="bg-purple-600 hover:bg-purple-500 transition-colors px-4 py-1.5 rounded-full shadow-lg"
            >
              Restart
            </button>
          </div>
        </div>

        {isGameOver ? (
          <div className="text-center py-12 animate-fade-in">
            <h2 className="text-3xl font-bold mb-4 text-green-300">You Won! 🎉</h2>
            <p className="text-xl">Completed in {moves} moves.</p>
            <button 
              onClick={initializeGame}
              className="mt-6 bg-white text-purple-700 font-bold px-8 py-3 rounded-full hover:bg-purple-100 transition-colors shadow-xl"
            >
              Play Again
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-4">
            {cards.map((card, index) => {
              const isFlipped = flipped.includes(index) || matched.includes(index);
              
              return (
                <div 
                  key={card.id}
                  onClick={() => handleCardClick(index)}
                  className="relative h-20 w-full sm:h-24 cursor-pointer perspective-1000 group"
                  style={{ perspective: '1000px' }}
                >
                  <div 
                    className={`absolute inset-0 w-full h-full transition-all duration-500 preserve-3d shadow-md rounded-xl ${
                      isFlipped ? 'rotate-y-180' : ''
                    }`}
                  >
                    {/* Front of card (hidden state) */}
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center backface-hidden border-2 border-white/10 group-hover:scale-105 transition-transform">
                      <span className="text-2xl text-white/50 font-bold">?</span>
                    </div>

                    {/* Back of card (revealed state) */}
                    <div 
                      className={`absolute inset-0 w-full h-full rounded-xl flex items-center justify-center backface-hidden rotate-y-180 border-2 ${
                        matched.includes(index) ? 'bg-green-400 border-green-200' : 'bg-white border-white'
                      }`}
                    >
                      <span className="text-4xl drop-shadow-sm">{card.emoji}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
