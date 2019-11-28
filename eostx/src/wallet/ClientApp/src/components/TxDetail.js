import React, { Component } from 'react';
import './Table.css';

export class TxDetail extends Component {
  static displayName = TxDetail.name;

  constructor (props) {
    super(props);
    this.state = { tx: {}, loading: true };

    fetch('api/Chain/Tx', { 
        body: JSON.stringify({ id: this.props.match.params.id }), 
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: 'POST' 
      })
      .then(response => response.json())
      .then(data => {
        this.setState({ tx: data, loading: false });
      });
  }

  static renderTxDetailTable (tx) {
    return (
      <table className='table table-striped'>
        <tbody>
          {Object.keys(tx).map(key =>
            <tr key={key}>
              <th>{key}</th>
              <td className='text-break'>{JSON.stringify(tx[key])}</td>
            </tr>
          )}
        </tbody>
      </table>
    );
  }

  render () {
    let contents = this.state.loading
      ? <p><em>Loading...</em></p>
      : TxDetail.renderTxDetailTable(this.state.tx);

    return (
      <div>
        <h1>Transaction</h1>
        {contents}
      </div>
    );
  }
}
