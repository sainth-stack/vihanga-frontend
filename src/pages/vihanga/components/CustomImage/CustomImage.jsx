import React from "react";

const CustomImage = ({
  src,
  alt = "Image",
 
  styles = {},
}) => {
  return (
    <img
      src={src}
      alt={alt}
      style={{
    // Optional shadow
        ...styles, // Merge custom styles if any
      }}
    />
  );
};

export default CustomImage;
