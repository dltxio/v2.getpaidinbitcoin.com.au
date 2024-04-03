import React, { useState } from "react";
import Table from "react-bootstrap/Table";
import "./Table.scss";

/**
 * Table with column headers
 * @param {array} data data to display
 * @param {object} columnConfig config for each column field such as children (display column name), hidden, dataFormat (a function to manipulate the data).
 *   Example:
 *   ```
 *   columnConfig = {
 *    "id": { children: "ID", hidden: true },
 *    "name": { children: "Name" },
 *    "date": { children: "Date", dataFormat: (cell) => moment(cell).format("DD-MM-YYYY") },
 *   }
 *   ```
 * @param {boolean} pagination enable pagination
 * @param {string} selectOption "radio" or "checkbox". Default to null. Must also provide setSelectedRow function.
 * @param {useState_SetFunction} setSelectedRow
 * @returns
 */
const TableWithHead = ({
  data = [],
  columnConfig = {},
  pagination = false,
  selectOption = null,
  setSelectedRow = null,
  ...props
}) => {
  const hasOptionColumn = (selectOption === "radio" || selectOption === "checkbox") && setSelectedRow;

  const handleRowClick = (index) => {
    if (!hasOptionColumn) return;
    if (selectOption === "radio") setSelectedRow(index);
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
                  class="form-check-input"
                  type="radio"
                  name="rowOptions"
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
      <Table className="table-hover" striped {...props}>
        <thead>
          <tr>
            {hasOptionColumn && <th></th> /* select input column */}
            {columns}
          </tr>
        </thead>
        <tbody>{renderTableRows()}</tbody>
      </Table>

      {pagination && (
        <div className="pagination">
          <span>Show </span>
          <select
            className="form-select"
            value={itemsPerPage}
            onChange={handlePageSizeChange}
            style={{ cursor: "pointer" }}
          >
            {paginationSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <span> rows per page</span>

          <ul className="pagination">
            <li className={`page-item ${currentPage <= 1 && "disabled"}`}>
              <a className="page-link cursor-pointer" onClick={prevPage}>
                <span>{"<"}</span>
              </a>
            </li>
            <li>
              <a className="page-link">{currentPage}</a>
            </li>
            <li className={`page-item ${currentPage >= maxPage && "disabled"}`}>
              <a className="page-link cursor-pointer" onClick={nextPage}>
                <span>{">"}</span>
              </a>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default TableWithHead;
