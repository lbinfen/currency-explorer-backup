import React, { Component } from 'react';
import './Table.css';

export class KeyDetail extends Component {
  static displayName = KeyDetail.name;

  constructor (props) {
    super(props);
    this.state = { key: {}, loading: true };

    fetch('api/Chain/Key', { 
        body: JSON.stringify({publicKey: this.props.match.params.id}), 
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: 'POST' 
      })
      .then(response => response.json())
      .then(data => {
        this.setState({ key: data, loading: false });
      });
  }

  static renderKeyDetailTable (keyInfo) {
    return (
      <table className='table table-striped'>
        <tbody>
          {Object.keys(keyInfo).map(i =>
            <tr key={i}>
              <th>{i}</th>
              <td className='text-break'>{keyInfo[i]}</td>
            </tr>
          )}
        </tbody>
      </table>
    );
  }

  render () {
    let contents = this.state.loading
      ? <p><em>Loading...</em></p>
      : KeyDetail.renderKeyDetailTable(this.state.key);

    return (
      <div>
        <h1>Public Key</h1>
        <h4>{this.props.match.params.id}</h4>
        {contents}
      </div>
    );
  }
}
