import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TablePagination,
  TableRow,
  TableHead,
  IconButton,
  Paper
} from '@material-ui/core';
import {makeStyles, useTheme} from '@material-ui/core/styles';
import {KeyboardArrowLeft, KeyboardArrowRight} from '@material-ui/icons';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import LastPageIcon from '@material-ui/icons/LastPage';

import PropTypes from 'prop-types';

function TransactionsList({transactions}) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, transactions.length - page * rowsPerPage);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (<TableContainer component={Paper}>
    <Table aria-label="custom pagination table" size="small">
      <TableHead>
        <TableRow>
          <TableCell>Store</TableCell>
          <TableCell align="right">Amount</TableCell>
          <TableCell align="right">Category</TableCell>
          <TableCell align="right">Date</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {
          (
            rowsPerPage > 0
            ? transactions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : transactions).map((row) => (<TableRow key={row.store}>
              <TableCell component="th" scope="row">
                {row.store}
              </TableCell>
              <TableCell align="right">{row.amount}</TableCell>
              <TableCell align="right">{row.category}</TableCell>
              <TableCell align="right">{row.date}</TableCell>
            </TableRow>))
        }

        {
          emptyRows > 0 && (<TableRow style={{
              height: 53 * emptyRows
            }}>
            <TableCell colSpan={6}/>
          </TableRow>)
        }
      </TableBody>
      <TableFooter>
        <TableRow>
          <TablePagination rowsPerPageOptions={[
              5,
              10,
              25, {
                label: 'All',
                value: -1
              }
            ]} colSpan={3} count={transactions.length} rowsPerPage={rowsPerPage} page={page} onChangePage={handleChangePage} onChangeRowsPerPage={handleChangeRowsPerPage}/>
        </TableRow>
      </TableFooter>
    </Table>
  </TableContainer>);
}

export default TransactionsList;
