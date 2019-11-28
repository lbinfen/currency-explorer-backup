import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { Blocks } from './components/Blocks';
import { Transfers } from './components/Transfers';
import { Producers } from './components/Producers';
import { KeyDetail } from './components/KeyDetail';
import { TxDetail } from './components/TxDetail';
import { BlockDetail } from './components/BlockDetail';
import { AccountDetail } from './components/AccountDetail';
import { Wallet } from './components/Wallet';

export default class App extends Component {
  static displayName = App.name;

  render () {
    return (
      <Layout>
        <Route exact path='/' component={Home} />
        <Route path='/blocks' component={Blocks} />
        <Route path='/transfers' component={Transfers} />
        <Route path='/producers' component={Producers} />
        <Route path='/key/:id' component={KeyDetail} />
        <Route path='/tx/:id' component={TxDetail} />
        <Route path='/block/:id' component={BlockDetail} />
        <Route path='/account/:id' component={AccountDetail} />
        <Route path='/wallet' component={Wallet} />
      </Layout>
    );
  }
}
