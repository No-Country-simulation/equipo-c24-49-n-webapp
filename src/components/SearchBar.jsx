"use client";

import { useState } from "react";

const SearchBar = () => {
  const [isFocused, setIsFocused] = useState(false);
  const [query, setQuery] = useState("");

  return (
    <div className="relative flex transition-all duration-200">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center">
        <img src="/search-icon.svg" alt="Buscar" className="w-4 h-4" />
      </div>

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder="Buscar"
        className={`pl-10 pr-4 py-2 rounded-full shadow placeholder-gray-500 text-center focus:text-left transition-all ${
          isFocused ? "w-80 duration-300" : "w-64 duration-200"
        }`}
      />
    </div>
  );
};

export default SearchBar;
