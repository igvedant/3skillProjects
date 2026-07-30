import React, { createContext, useState, useEffect, useContext } from 'react';

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('havenkey_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  const [compareItems, setCompareItems] = useState(() => {
    const saved = localStorage.getItem('havenkey_compare');
    return saved ? JSON.parse(saved) : [];
  });

  const [isCompareOpen, setIsCompareOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('havenkey_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('havenkey_compare', JSON.stringify(compareItems));
  }, [compareItems]);

  const toggleFavorite = (propertyId) => {
    setFavorites((prev) =>
      prev.includes(propertyId) ? prev.filter((id) => id !== propertyId) : [...prev, propertyId]
    );
  };

  const isFavorite = (propertyId) => favorites.includes(propertyId);

  const toggleCompare = (propertyId) => {
    setCompareItems((prev) => {
      if (prev.includes(propertyId)) {
        return prev.filter((id) => id !== propertyId);
      }
      if (prev.length >= 4) {
        alert('You can compare a maximum of 4 properties at a time.');
        return prev;
      }
      return [...prev, propertyId];
    });
  };

  const isCompared = (propertyId) => compareItems.includes(propertyId);

  const clearCompare = () => setCompareItems([]);

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        toggleFavorite,
        isFavorite,
        compareItems,
        toggleCompare,
        isCompared,
        clearCompare,
        isCompareOpen,
        setIsCompareOpen
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);
