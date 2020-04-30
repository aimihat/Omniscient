import React from 'react';
import ReactDOM from 'react-dom';
import {Container, Typography, Button, Grid, Box} from '@material-ui/core';
import {Skeleton} from '@material-ui/lab'
import TitleBar from './components/TitleBar'
import Summary from './components/Summary'
import DailyView from './components/DailyView'

import TransactionsList from './components/TransactionsList'
import LockIcon from '@material-ui/icons/Lock';
import Fab from '@material-ui/core/Fab';
import {makeStyles} from '@material-ui/core/styles';
import config from './config';

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center"
  }
}));

function App() {
  const classes = useStyles();

  const getPlaidAccounts = () => {
    const storedAccounts = window.localStorage.getItem("plaid_items");
    if (storedAccounts) {
      return JSON.parse(storedAccounts);
    } else {
      window.localStorage.setItem("plaid_items", JSON.stringify([]));
      return [];
    }
  }

  const [accounts, setAccounts] = React.useState(getPlaidAccounts);
  const [transactions, setTransactions] = React.useState(null);

  React.useEffect(()=> {
    if (accounts.length === 0) {
      return
    }
    window.fetch("http://lvh.me:7000/transactions", {
      method: 'POST',
      headers: {
        'content-type': 'application/json;charset=UTF-8'
      },
      body: JSON.stringify({access_token: accounts[0][1]})
    }).then(r => r.json()).then(response => {
      setTransactions(response.map(t => {return {
        amount : t.amount,
        store: t.name,
        date: t.date,
        category: t.category[1]
      }}))
    })
  }, [accounts])

  /*global Plaid*/
  /*global $*/
  var plaidLinkHandler = Plaid.create({
    clientName: 'Omniscient',
    countryCodes: ['US'],
    env: 'sandbox',
    key: '4fcccae7bfd43b8b5b607099f46e79',
    product: [
      'transactions', 'auth'
    ],
    accountSubtypes: {
      depository: ['checking', 'savings']
    },
    language: 'en',
    onSuccess: function(public_token, metadata) {
      console.log(public_token);
      window.fetch("http://lvh.me:7000/get_access_token", {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({public_token: public_token})
      }).then(r => r.json()).then(r => {
        const plaid_items = JSON.parse(window.localStorage.getItem("plaid_items"));
        if (plaid_items.indexOf(public_token) === -1) {
          plaid_items.push([r.item_id, r.access_token]);
        }
        window.localStorage.setItem("plaid_items", JSON.stringify(plaid_items))
        setAccounts(plaid_items);
      })
    }
  });

  const Data = (accounts.length > 0) && (transactions)
    ? (() => {
      return (<React.Fragment>
        <DailyView transactions={transactions} />
        <TransactionsList transactions={transactions}/>
      </React.Fragment>)
    })
    : () => null;

  return (<Container maxWidth="sm">
    <Button startIcon={<LockIcon />} onClick={() => {
        window.localStorage.setItem("plaid_items", JSON.stringify([]));
        setAccounts([]);
      }}>
      Disconnect
    </Button>
    <TitleBar accounts={accounts} plaidHandler={plaidLinkHandler}/>
    <Summary accounts={accounts}/>
    <Data/>
  </Container>);
}

export default App;
