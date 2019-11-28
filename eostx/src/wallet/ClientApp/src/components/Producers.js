import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { NavLink } from 'reactstrap';
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table"
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css"

export class Producers extends Component {
  static displayName = Producers.name;

  constructor (props) {
    super(props);
    this.state = { producers: [], loading: true };

    fetch('api/Chain/Producers')
      .then(response => response.json())
      .then(data => {
        this.setState({ producers: data, loading: false });
      });
  }

  static renderProducersTable (producers) {
    return (
      <Table className='table table-striped'>
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Localtion</Th>
            <Th>IsActive</Th>
            <Th>Txfee</Th>
          </Tr>
        </Thead>
        <Tbody>
          {producers.map(producer =>
            <Tr key={producer.owner}>
              <Td><NavLink tag={Link} to={"/Account/".concat(producer.owner)}>{producer.owner}</NavLink></Td>
              <Td>{producer.localtion}</Td>
              <Td>{producer.isActive}</Td>
              <Td>{producer.unpaidTxfee}</Td>
            </Tr>
          )}
        </Tbody>
      </Table>
    );
  }

  render () {
    let contents = this.state.loading
      ? <p><em>Loading...</em></p>
      : Producers.renderProducersTable(this.state.producers);

    return (
      <div>
        <h1>Producers</h1>
        {contents}
      </div>
    );
  }
}
