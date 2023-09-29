import React from "react";
import { useParams } from "react-router-dom";
import Search from "./Search";

const SearchPage = ({ videos }) => {
  const { searchTerm } = useParams();

  // Filter videos based on the search term
  const filteredVideos = videos.filter(
    (video) => video.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return <Search videos={filteredVideos} />;
};

export default SearchPage;

