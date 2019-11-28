import React, { Component } from 'react';
import './Table.css';

export class BlockDetail extends Component {
  static displayName = BlockDetail.name;

  constructor (props) {
    super(props);
    this.state = { block: {}, loading: true };

    fetch('api/Chain/Block', { 
        body: JSON.stringify({blockNumOrId:this.props.match.params.id}), 
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: 'POST' 
      })
      .then(response => response.json())
      .then(data => {
        this.setState({ block: data, loading: false });
      });
  }

  static renderBlockDetailTable (block) {
    return (
      <table className='table table-striped'>
        <tbody>
          {Object.keys(block).map(key =>
            <tr key={key}>
              <th>{key}</th>
              <td className='text-break'>{JSON.stringify(block[key])}</td>
            </tr>
          )}
        </tbody>
      </table>
    );
  }

  render () {
    let contents = this.state.loading
      ? <p><em>Loading...</em></p>
      : BlockDetail.renderBlockDetailTable(this.state.block);

    return (
      <div>
        <h1>Block {this.props.match.params.id}</h1>
        {contents}
      </div>
    );
  }
}
