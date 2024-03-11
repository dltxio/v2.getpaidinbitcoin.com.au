import React, { useState } from "react";
import Table from "react-bootstrap/Table";
import Pagination from "react-bootstrap/Pagination";

const TableWithHead = ({
  data = [],
  columnConfig = {},
  hidden = [],
  pagination = false,
  selectedRow,
  setSelectedRow,
  ...props
}) => {
  const handleRowClick = (index) => {
    if (setSelectedRow) setSelectedRow(index);
  };

  // Pagination
  let currentItems = data;
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const maxPage = Math.ceil(data.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  if (pagination) {
    currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
  }

  return (
    <>
      <Table className="table-hover" {...props}>
        <thead>
          <tr>
            {setSelectedRow && <th></th>}
            {Object.keys(columnConfig)
              .filter((dataField) => !columnConfig[dataField].hidden)
              .map((dataField) => (
                <th key={dataField}>{columnConfig[dataField].children}</th>
              ))}
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item, index) => (
            <tr
              key={item.id}
              onClick={() => handleRowClick(index)}
              style={{
                cursor: "pointer",
                backgroundColor: index === selectedRow ? "lightblue" : "inherit"
              }}
            >
              {setSelectedRow && (
                <td>
                  <input
                    type="radio"
                    name="selectRow"
                    checked={index === selectedRow}
                    onChange={() => handleRowClick(index)}
                  />
                </td>
              )}
              {Object.keys(columnConfig)
                .filter((dataField) => !columnConfig[dataField].hidden)
                .map((dataField) => (
                  <td key={dataField}>{item[dataField]}</td>
                ))}
            </tr>
          ))}

          {/* No data text */}
          {data.length === 0 && (
            <tr>
              <td
                className="text-center"
                colSpan={Object.keys(columnConfig).length}
              >
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {pagination && (
        <Pagination>
          <Pagination.Prev
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            Previous
          </Pagination.Prev>
          <Pagination.Item>{currentPage}</Pagination.Item>
          <Pagination.Next
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage >= maxPage}
          >
            &emsp;Next&emsp;
          </Pagination.Next>
        </Pagination>
      )}
    </>
  );
};

export default TableWithHead;
