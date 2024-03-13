import React, { useState } from "react";
import Table from "react-bootstrap/Table";
import Pagination from "react-bootstrap/Pagination";
import "./Table.scss";

/**
 * Table with column headers
 * @param {data} array data to display
 * @param {columnConfig} object config for each column field such as children (display column name), hidden, dataFormat (a function to manipulate the data).
 *   Example:
 *   ```
 *   columnConfig = {
 *    "id": { children: "ID", hidden: true },
 *    "name": { children: "Name" },
 *    "date": { children: "Date", dataFormat: (cell) => moment(cell).format("DD-MM-YYYY") },
 *   }
 *   ```
 * @param {hidden} array specify columns to hide. Unused, todo: remove this or remove columnConfig
 * @param {pagination} boolean enable pagination
 * @param {selectedRow} useState_Value adding this will add a radio button column on the left.
 * @param {setSelectedRow} useState_SetFunction
 * @returns
 */
const TableWithHead = ({
  data = [],
  columnConfig = {},
  hidden = [],
  pagination = false,
  selectedRow = null,
  setSelectedRow = null,
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
            style={{ cursor: "pointer" }}
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
              .map((dataField) => {
                // if there is a dataFormat function, use it to format the data
                let cell = item[dataField];
                if (columnConfig[dataField].dataFormat)
                  cell = columnConfig[dataField].dataFormat(cell);
                return <td key={dataField}>{cell}</td>;
              })}
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

  const columns = Object.keys(columnConfig)
    .filter((dataField) => !columnConfig[dataField].hidden)
    .map((dataField) => (
      <th key={dataField}>{columnConfig[dataField].children}</th>
    ));

  const nextPage = () => {
    if (currentPage < maxPage) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="table-with-head">
      <Table className="table-hover" {...props}>
        <thead>
          <tr>
            {setSelectedRow && <th></th> /* Radio button column */}
            {columns}
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
              <Pagination.Prev onClick={prevPage} disabled={currentPage <= 1}>
                Previous
              </Pagination.Prev>
              <Pagination.Item>{currentPage}</Pagination.Item>
              <Pagination.Next
                onClick={nextPage}
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
