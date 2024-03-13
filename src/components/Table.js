import React, { useState } from "react";
import Table from "react-bootstrap/Table";
import Pagination from "react-bootstrap/Pagination";
import "./Table.scss"

/**
 * Table with column headers
 * @param {data} array[object] data to display
 * @param {columnConfig} array[object] config for each column such as name, size, etc.
 * @param {hidden} array specify columns to hide. Unused, todo: remove this or remove columnConfig
 * @param {pagination} boolean enable pagination
 * @param {selectedRow} useState_Value
 * @param {setSelectedRow} useState_SetFunction
 * @returns
 */
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
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const paginationSizeOptions = [10, 20, 50, 100];
  const maxPage = Math.ceil(data.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const handlePageSizeChange = (e) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1); // Reset to first page when pagination size changes
  };

  if (pagination) {
    currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
  }

  const renderTableRows = () => {
    return (
      <>
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
      </>
    );
  };

  return (
    <div className="table-with-head">
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
        <tbody>{renderTableRows()}</tbody>
      </Table>

      {pagination && (
        <div className="pagination">
          <span>Show </span>
          <select value={itemsPerPage} onChange={handlePageSizeChange}>
            {paginationSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <span> rows per page</span>
          <span>
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
          </span>
        </div>
      )}
    </div>
  );
};

export default TableWithHead;
