import React, { Component } from 'react';
import './Table.css';
import { Transfers } from './Transfers';

export class AccountDetail extends Component {
  static displayName = AccountDetail.name;

  constructor (props) {
    super(props);
    this.state = { account: {}, loading: true, name: this.props.match.params.id };

    fetch('api/Chain/Account', { 
        body: JSON.stringify({ name: this.props.match.params.id }), 
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: 'POST' 
      })
      .then(response => response.json())
      .then(data => {
        this.setState({ account: data, loading: false });
      });
  }

  static renderAccountDetailTable (account, id) {
    return (
      <div>
        <table className='table table-striped'>
          <tbody>
            {Object.keys(account).map(key =>
              <tr key={key}>
                <th>{key}</th>
                <td className='text-break'>{JSON.stringify(account[key])}</td>
              </tr>
            )}
          </tbody>
        </table>
        <Transfers owner={id} />
      </div>
    );
  }

  render () {
    let contents = this.state.loading
      ? <p><em>Loading...</em></p>
      : AccountDetail.renderAccountDetailTable(this.state.account, this.state.name);

    return (
      <div>
        <h1>Account {this.props.match.params.id}</h1>
        {contents}
      </div>
    );
  }
}
