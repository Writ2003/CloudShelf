import React, { useState, useRef, useEffect } from "react";

const ExpandableInlineText = ({ text }) => {
  const [showSeeMore, setShowSeeMore] = useState(false); // State to control "See More" visibility
  const textRef = useRef(null); // Reference to the text container
  const [expandText, setExpandText] = useState(false);
  useEffect(() => {
    const checkOverflow = () => {
      if (textRef.current) {
        const isOverflowing =
        textRef.current.scrollHeight > textRef.current.clientHeight;
        setShowSeeMore(isOverflowing);
      }
    };

    checkOverflow(); // Initial check
    window.addEventListener("resize", checkOverflow); // Recheck on window resize

    return () => {
      window.removeEventListener("resize", checkOverflow); // Cleanup event listener
    };
  }, [text]);

  return (
    <div className="flex items-end">
      {/* Text Container */}
      <span
        ref={textRef}
        className={`text-overflow text-[14px] ${
          expandText ? "line-clamp-none" : "line-clamp-2"
        }`}
      >
        {text}
      </span>

      {/* See More Button */}
      {showSeeMore && (
        <button onClick={() => setExpandText((prev) => !prev)} className="text-blue-500 hover:underline cursor-pointer text-nowrap">
          {expandText ? "See Less" : "See More"}
        </button>
      )}
    </div>
  );
};

export default ExpandableInlineText;