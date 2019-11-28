import React, { Component } from 'react';

export class Wallet extends Component {
  static displayName = Wallet.name;

  constructor (props) {
    super(props);
    this.state = { from: '', to: '', quantity: 0, fee: 0, memo: '' };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange (event) {
    console.log(event.target);
    this.setState({ from: event.target.value });
  }

  handleSubmit (event) {
    console.log(this.props);
    console.log('A name was submitted: ' + this.props.from);
    event.preventDefault();
  }

  render () {
    return (
      <div>
        <div className="alert alert-info">
          <button type="button" className="btn btn-primary">登陆钱包</button>
        </div>
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label htmlFor="txtFrom">转出账号</label>
            <input type="text" className="form-control" id="txtFrom" placeholder="发起转账的账号" />
          </div>
          <div className="form-group">
            <label htmlFor="txtTo">转入账号</label>
            <input type="text" className="form-control" id="txtTo" placeholder="接收转账的账号" />
          </div>
          <div className="form-group">
            <label htmlFor="txtQuantity">数额</label>
            <input type="text" className="form-control" id="txtQuantity" placeholder="转账数额" />
          </div>
          <div className="form-group">
            <label htmlFor="txtMemo">备注</label>
            <input type="text" className="form-control" id="txtMemo" placeholder="转账备注（可选）" />
          </div>
          <button type="submit" className="btn btn-primary">转账</button>
        </form>
      </div>
    );
  }
}
