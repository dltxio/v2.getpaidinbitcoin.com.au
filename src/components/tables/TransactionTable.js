import React from 'react';
import moment from 'moment';
import { format as format$ } from 'currency-formatter';
import {
  BootstrapTable as Table,
  TableHeaderColumn as Column
} from 'react-bootstrap-table';
import prefixID from '../../utils/prefixID';

// dataField (key) props (value)
const columnConfig = {
  id: {
    children: 'ID',
    dataFormat: (cell) => prefixID(cell, 'D'),
    width: '8%',
    dataSort: true
  },
  amount: {
    children: 'Amount',
    dataFormat: (cell) => format$(cell, { code: 'AUD' }),
    width: '8%',
    dataSort: true
  },
  reference: {
    children: 'Reference',
    width: '45%',
    tdStyle: { whiteSpace: 'normal' },
    dataSort: true
  },
  fee: {
    children: 'Fee',
    dataFormat: (cell) => format$(cell, { code: 'AUD' }),
    dataSort: true
  },
  bank: { children: 'Bank', width: '15%', dataSort: true },
  bankID: { children: 'Bank ID', width: '5%', dataSort: true },
  created: {
    children: 'Created',
    dataFormat: (cell) => cell && moment(cell).format('DD-MM-YYYY'),
    width: '10%',
    dataSort: true
  }
};

const options = {
  defaultSortName: 'id',
  defaultSortOrder: 'desc'
};

const DepositsTable = ({ deposits, selectRow, hidden = [] }) => (
  <Table
    data={deposits}
    striped
    hover
    version="4"
    pagination
    selectRow={selectRow}
    tableContainerClass="table-responsive"
    keyField="id"
    options={options}
  >
    {Object.keys(columnConfig)
      .filter((dataField) => hidden.indexOf(dataField) < 0)
      .map((dataField) => (
        <Column
          key={dataField}
          dataField={dataField}
          {...columnConfig[dataField]}
        />
      ))}
  </Table>
);

export default DepositsTable;
