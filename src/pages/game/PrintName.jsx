import { useState, useEffect } from "react";

const PrintName = ({ data, clearString }) => {
  const [displayString, setDisplayString] = useState("");

  useEffect(() => {
    console.log("Data: ", data);
    if (data) {
      const { str_len, index } = data;

      // Initialize display string with underscores if it's empty or length changed
      if (displayString.length !== str_len) {
        setDisplayString("_".repeat(str_len));
        return;
      }

      // Update the display string with received characters
      let updatedString = displayString.split("");
      for (const i in index) {
        updatedString[i] = index[i];
      }

      setDisplayString(updatedString.join(""));
    }
  }, [data, displayString]);

  useEffect(() => {
    if (clearString) setDisplayString("");
  }, [clearString]);

  return (
    <div className="text-3xl font-semibold">
      <span className="text-gray-500"></span> {displayString}
    </div>
  );
};

export default PrintName;
