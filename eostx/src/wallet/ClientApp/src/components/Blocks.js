import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { NavLink } from 'reactstrap';
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table"
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css"
import Pagination from "react-js-pagination";

export class Blocks extends Component {
  static displayName = Blocks.name;

  itemsCountPerPage = 10;

  constructor (props) {
    super(props);
    this.state = { blocks: [], loading: true, activePage: 1 };

    this.handlePageChange = this.handlePageChange.bind(this);

    this.handlePageChange(1);
  }

  handlePageChange(pageNumber) {
    let num = pageNumber === 1 ? 0 : this.state.blocks.total;
    fetch(`api/Chain/Blocks?skip=${(pageNumber - 1) * this.itemsCountPerPage}&limit=${this.itemsCountPerPage}&num=${num}`)
      .then(response => response.json())
      .then(data => {
        this.setState({ blocks: data, loading: false, activePage: pageNumber });
      });
  }

  renderBlocksTable () {
    return (
      <div>
        <Table className='table table-striped'>
          <Thead>
            <Tr>
              <Th>Block</Th>
              <Th>Time</Th>
              <Th>Producer</Th>
              <Th>Txns</Th>
            </Tr>
          </Thead>
          <Tbody>
            {this.state.blocks.data.map(block =>
              <Tr key={block.id}>
                <Td><NavLink tag={Link} to={"/Block/".concat(block.num)}>{block.num}</NavLink></Td>
                <Td>{block.time}</Td>
                <Td><NavLink tag={Link} to={"/Account/".concat(block.producer)}>{block.producer}</NavLink></Td>
                <Td>{block.txns}</Td>
              </Tr>
            )}
          </Tbody>
        </Table>
        <Pagination innerClass="pagination justify-content-center" itemClass="page-item" linkClass="page-link" 
          itemsCountPerPage={this.itemsCountPerPage} 
          totalItemsCount={this.state.blocks.total} 
          pageRangeDisplayed={5} 
          onChange={this.handlePageChange} 
          activePage={this.state.activePage} />
      </div>
    );
  }

  render () {
    let contents = this.state.loading
      ? <p><em>Loading...</em></p>
      : this.renderBlocksTable();

    return (
      <div>
        <h1>Blocks</h1>
        {contents}
      </div>
    );
  }
}
