import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

export class Home extends Component {
  static displayName = Home.name;

  constructor (props) {
    super(props);
    this.state = { keyword: '', searchClicked: false, searchType: '' };
    this.onSearch = this.onSearch.bind(this);
    this.onKeywordChange = this.onKeywordChange.bind(this);
    this.onSearchKeyDown = this.onSearchKeyDown.bind(this);
  }

  onKeywordChange (event) {
    this.setState({ keyword: event.target.value });
  }

  onSearch () {
    let keyword = this.state.keyword.trim(); 
    if(keyword.length > 0) {
      //pubkey
      if(keyword.length === 53 || keyword.length === 54){
        this.setState({ searchClicked: true, searchType: 'Key' });
      } else if(keyword.length === 64) {//TX OR BLOCK
        this.setState({ searchClicked: true, searchType: 'Tx' });
      } else {
        
        if(isNaN(Number.parseInt(keyword, 10))) {//Account
          this.setState({ searchClicked: true, searchType: 'Account' });
        } else {//Block
          this.setState({ searchClicked: true, searchType: 'Block' });
        }
      }
    }
  }

  onSearchKeyDown(event) {
    if (event.key === 'Enter') {
      this.onSearch();
    }
  }

  render () {
    if(this.state.searchClicked){
      return (
        <Redirect to={this.state.searchType.concat('/', this.state.keyword)}/>
      )
    }
    return (
      <div>
        <div className="input-group mb-3">
          <input type="text" className="form-control" placeholder="account / key / tx / block" onKeyDown={this.onSearchKeyDown} value={this.state.keyword} onChange={this.onKeywordChange} />
          <div className="input-group-append">
            <button className="btn btn-outline-secondary" onClick={this.onSearch} type="button">Search</button>
          </div>
        </div>
      </div>
    );
  }
}
