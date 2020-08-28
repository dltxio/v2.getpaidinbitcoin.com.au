import { useState } from "react";

const useSelectedRows = (initialValue, tableConfig = {}) => {
  const [selected, setSelected] = useState(initialValue);
  const defaultConfig = {
    mode: "radio",
    onSelect: (row) => setSelected(row.id)
  };

  const config = { ...defaultConfig, ...tableConfig, selected: [selected] };
  return [selected, setSelected, config];
};

export default useSelectedRows;
