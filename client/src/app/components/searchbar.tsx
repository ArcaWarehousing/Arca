"use client";
import React, { useState, FC, FormEvent } from "react";

//this is the method the search bar inherits this needs to be improved!
interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState<string>("");
  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="flex items-center w-full max-w-md mx-auto bg-white rounded-xl shadow-md"
    >
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Find a storage near you..."
        className="w-full px-4 py-3 rounded-l-xl border-none focus:outline-none"
      />
      <button type="submit" className="py-4 px-3 bg-[#a3c7cc] rounded-r-xl border-none">
        ↗
      </button>
    </form>
  );
};

export default SearchBar;
