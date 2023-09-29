import React, { useEffect, useState } from "react";
import { getFirestore } from "firebase/firestore";

import { firebaseApp } from "../firebase-config";
import { categoryFeeds, getAllFeeds } from "../utils/fetchData";
import Spinner from "../Components/Spinner";
import { Box, Flex, SimpleGrid } from "@chakra-ui/react";
import { VideoPin } from ".";
import { useParams } from "react-router-dom";
import NotFound from "./NotFound";

const Feed = ({ feeds, loading, setCategoryId}) => {

  const { categoryId } = useParams();
  
  useEffect(() => {
    setCategoryId(categoryId);
  }, [categoryId]);
  if (loading) return <Spinner msg={"Loading your feeds"} />;
  if (!feeds?.length > 0) return <NotFound />;

  return (
    
    <SimpleGrid 
      column={5}
      minChildWidth="300px"
      spacing="15px"
      width="full"
      // width="60em"
      // height="50%"
      autoColumns={"max-content"}
      overflowX={"hidden"}
    >
      {/* render the feeds  */}
      {feeds &&
        feeds.map((data) => (
          <VideoPin key={data.id} maxWidth={420} height="80px"  data={data}/>
          // <VideoPin key={data.id} maxWidth={420} height="20em"  data={data}/>
        ))}
        {/* we are rendering the video pin here */}
    </SimpleGrid>
  );
};

export default Feed;