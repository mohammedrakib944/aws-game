import { useState, useEffect } from "react";
import { STATUS } from "../Game";

const PrintName = ({ data, status }) => {
  const [displayString, setDisplayString] = useState("");

  useEffect(() => {
    if (data?.clear || status === STATUS.GAME_OVER) setDisplayString("");

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
  }, [data, displayString, status]);

  return (
    <div className="text-3xl font-semibold">
      {status === STATUS.GAME_OVER ? "" : <>{displayString}</>}
    </div>
  );
};

export default PrintName;
