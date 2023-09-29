import React from 'react'
import { Box, Flex, Tooltip, useColorMode, useColorModeValue,} from "@chakra-ui/react";

  import { Link } from "react-router-dom";

// Restructure the data prop
const Category = ({data}) => {

  // to change the color mode
    const { colorMode } = useColorMode();
    const bg = useColorModeValue("gray.600", "gray.300");

  return (
    <Flex cursor={"pointer"} my="5">
    {/* on clicking the user navigate to the specific category 
    Link --> comes from React Router Dom */}
    <Link to={`/category/${data.name}`}>
      <Tooltip
        hasArrow
        placement="right"
        closeDelay={300}
        arrowSize={5}
        label={data.name}
        bg={bg}
      >
        <Box>{data.iconSrc}</Box>
        {/* <Box> */}
        {/* {data.iconSrc} */}
          {/* Display the category name directly on the Box */}
          {/* {data.name} */}
        {/* </Box> */}
      </Tooltip>
    </Link>
  </Flex>
  )
}

export default Category