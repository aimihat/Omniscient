import React from 'react'
import {Typography, Grid} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import {Alert, AlertTitle} from '@material-ui/lab';
import Bank from './Bank';
import config from '../config';

const useStyles = makeStyles((theme) => ({
  bank_grid: {
    marginTop: "30px",
    marginBottom: "30px"
  }
}))

function Summary({accounts}) {
  const classes = useStyles();
  const [balances, setBalances] = React.useState(null);

  React.useEffect(() => {
    if (accounts.length === 0) {
      return;
    }
    window.fetch("http://lvh.me:7000/accounts/balance/get", {
      method: 'POST',
      headers: {
        'content-type': 'application/json;charset=UTF-8'
      },
      body: JSON.stringify({access_token: accounts[0][1]})
    }).then(r => r.json()).then(response => {
      setBalances(response.filter(acc => acc.type === "depository").map(acc => {return {
        name : acc.official_name,
        balance: acc.balances.current,
        image_url: ""
      }}))
    })
  }, [accounts])

  if (balances && (accounts.length > 0)) {
    return (<Grid container
  direction="row"
  justify="center"
	spacing={2}
  alignItems="center" className={classes.bank_grid}>
      {
        balances.map((balance) => (<Grid key={balance.name} item xs={3}>
          <Bank {...balance}/>
        </Grid>))
      }
    </Grid>);
  } else {
    return (<Alert severity="info">
      <AlertTitle>You currently have no accounts.</AlertTitle>
      Press the 'add' button to link your first current depository account.
    </Alert>)
  }
}

export default Summary;
