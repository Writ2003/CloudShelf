const parseMentions = (text) => {
  const parts = text.split(/(@\S+)/g); // splits into mentions and non-mentions
  return parts.map((part, i) => {
    if (part.startsWith('@')) {
      return (
        <span key={i} className="text-blue-600 font-medium">
          {part}
        </span>
      );
    }
    return part;
  });
};

export default parseMentions;