import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { NavLink } from 'reactstrap';
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table"
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css"
import Pagination from "react-js-pagination";

export class Transfers extends Component {
  static displayName = Transfers.name;

  itemsCountPerPage = 10;

  constructor (props) {
    super(props);
    this.state = { transfers: {}, loading: true, activePage: 1, owner: props.owner };

    this.handlePageChange = this.handlePageChange.bind(this);

    this.handlePageChange(1, props.owner);
  }

  handlePageChange(pageNumber, owner) {
    owner = owner || this.state.owner || '';
    fetch(`api/Chain/Transfers?skip=${(pageNumber - 1) * this.itemsCountPerPage}&limit=${this.itemsCountPerPage}&owner=${owner}`)
      .then(response => response.json())
      .then(data => {
        this.setState({ transfers: data, loading: false, activePage: pageNumber });
      });
  }

  renderTransfersTable () {
    let pagination = this.state.transfers.total <= this.itemsCountPerPage ? 
      <div></div> :
      <Pagination innerClass="pagination justify-content-center" itemClass="page-item" linkClass="page-link" 
      itemsCountPerPage={this.itemsCountPerPage} 
      totalItemsCount={this.state.transfers.total} 
      pageRangeDisplayed={5} 
      onChange={this.handlePageChange} 
      activePage={this.state.activePage} />;

    return (
      <div>
        <Table className='table table-striped'>
          <Thead>
            <Tr>
              <Th>Block</Th>
              <Th>Tx</Th>
              <Th>Time</Th>
              <Th>From</Th>
              <Th>To</Th>
              <Th>Quantity</Th>
              <Th>Memo</Th>
              <Th>Confirmations</Th>
            </Tr>
          </Thead>
          <Tbody>
            {this.state.transfers.data.map(transfer =>
              <Tr key={transfer.id}>
                <Td><NavLink tag={Link} to={"/Block/".concat(transfer.blockNum)}>{transfer.blockNum}</NavLink></Td>
                <Td><NavLink tag={Link} to={"/Tx/".concat(transfer.id)}>{transfer.id.substr(0,8)}</NavLink></Td>
                <Td>{transfer.time}</Td>
                <Td><NavLink target="_blank" tag={Link} to={"/Account/".concat(transfer.from)}>{transfer.from}</NavLink></Td>
                <Td><NavLink target="_blank" tag={Link} to={"/Account/".concat(transfer.to)}>{transfer.to}</NavLink></Td>
                <Td>{transfer.quantity}</Td>
                <Td>{transfer.memo}</Td>
                <Td>{transfer.confirmations}</Td>
              </Tr>
            )}
          </Tbody>
        </Table>
        {pagination}
      </div>
    );
  }

  render () {
    let contents = this.state.loading
      ? <p><em>Loading...</em></p>
      : this.renderTransfersTable();

    return (
      <div>
        <h1>Transactions</h1>
        {contents}
      </div>
    );
  }
}
