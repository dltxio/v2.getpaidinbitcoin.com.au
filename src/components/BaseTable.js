import React, { useState } from "react";
import Table from "react-bootstrap/Table";
import "./BaseTable.scss";
import ErrorMessage from "./ErrorMessage";

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
 * @param {string} selectOption "radio" or "checkbox". Default to null. Must also provide setSelectedRow function.
 * @param {string} errorMessage error message to display
 * @param {boolean} isLoading loading state
 * @param {object} options additional options such as order (des/asc), pagination.
 *    Example:
 *    ```
 *    options = {
 *      order: { dataField: "created", order: "des" },
 *      pagination: true
 *    }
 * @param {useState_SetFunction} setSelectedRow
 * @returns
 */
const BaseTable = ({
  data = [],
  columnConfig = {},
  selectOption = null,
  selectedRow = null,
  setSelectedRow = null,
  errorMessage = "",
  isLoading = false,
  options,
  ...props
}) => {
  const hasOptionColumn =
    (selectOption === "radio" || selectOption === "checkbox") && setSelectedRow;

  const handleRowClick = (index) => {
    if (!hasOptionColumn) return;
    if (selectOption === "radio") setSelectedRow(index);
  };

  let currentItems = data;

  // Sort data
  if (options?.order) {
    const field = options.order.dataField;
    const order = options.order.order;
    const dataFormat = options.order.dataFormat
      ? options.order.dataFormat
      : (cell) => cell;
    if (order === "asc") {
      currentItems = data.sort(
        (a, b) => dataFormat(a[field]) - dataFormat(b[field])
      );
    } else if (order === "des") {
      currentItems = data.sort(
        (a, b) => dataFormat(b[field]) - dataFormat(a[field])
      );
    }
  }

  // Pagination
  const paginationSizeOptions = [25, 50, 100, 1000];
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(paginationSizeOptions[0]);
  const maxPage = Math.ceil(data.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const handlePageSizeChange = (e) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1); // Reset to first page when pagination size changes
  };

  if (options?.pagination) {
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
            {hasOptionColumn && (
              <td className="text-center">
                <input
                  className="form-check-input"
                  type="radio"
                  name="rowOptions"
                  onChange={() => handleRowClick(index)}
                  checked={index === selectedRow}
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
        {!isLoading && currentItems.length === 0 && (
          <tr>
            <td
              className="text-center"
              colSpan={Object.keys(columnConfig).length}
            >
              No data available
            </td>
          </tr>
        )}
        {isLoading && currentItems.length === 0 && (
          <tr>
            <td
              className="text-center"
              colSpan={Object.keys(columnConfig).length}
            >
              Loading...
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

  const PaginationControl = () => {
    if (!options?.pagination) return null;
    return (
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
            <div className="page-link cursor-pointer" onClick={prevPage}>
              <span>{"<"}</span>
            </div>
          </li>
          <li>
            <div className="page-link">{currentPage}</div>
          </li>
          <li className={`page-item ${currentPage >= maxPage && "disabled"}`}>
            <div className="page-link cursor-pointer" onClick={nextPage}>
              <span>{">"}</span>
            </div>
          </li>
        </ul>
      </div>
    );
  };


  return (
    <>
      <ErrorMessage error={errorMessage} hidden={!errorMessage} />
      <div className="table-with-head">
        <Table responsive {...props}>
          <thead>
            <tr>
              {hasOptionColumn && <th></th> /* select input column */}
              {columns}
            </tr>
          </thead>
          <tbody>{renderTableRows()}</tbody>
        </Table>

        <PaginationControl />
      </div>
    </>
  );
};

export default BaseTable;
