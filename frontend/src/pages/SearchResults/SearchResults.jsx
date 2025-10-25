import React, { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import FoodItem from "../../components/FoodItem/FoodItem";
import "./SearchResults.css";

const SearchResults = () => {
  const { food_list } = useContext(StoreContext);
  const location = useLocation();
  const [filteredItems, setFilteredItems] = useState([]);

  const query = new URLSearchParams(location.search).get("q")?.toLowerCase() || "";

  useEffect(() => {
    if (query.trim() !== "") {
      const results = food_list.filter((item) =>
        item.name.toLowerCase().includes(query)
      );
      setFilteredItems(results);
    } else {
      setFilteredItems([]);
    }
  }, [query, food_list]);

  return (
    <div className="search-results-section">
      <h2>
        Search Results for: <em>{query}</em>
      </h2>
      {filteredItems.length > 0 ? (
        <div className="search-results-grid">
          {filteredItems.map((item) => (
            <FoodItem
              key={item._id}
              id={item._id}
              name={item.name}
              price={item.price}
              description={item.description}
              image={item.image}
            />
          ))}
        </div>
      ) : (
        <p className="no-results">No food items found for "{query}".</p>
      )}
    </div>
  );
};

export default SearchResults;
