import React from "react";
import { Table } from "react-bootstrap";

const LabelledTable = ({ columns, ...props }) => {
  return (
    <Table hover {...props}>
      <tbody>
        {columns.map(([label, value, config]) => (
          <tr key={label} {...config?.trProps}>
            <td>{label}</td>
            <td className="text-right">{value}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default LabelledTable;
