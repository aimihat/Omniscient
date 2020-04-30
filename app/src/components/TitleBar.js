import React from 'react'
import {IconButton, AppBar, Toolbar, Typography, Button} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';

const useStyles = makeStyles((theme) => ({
  fabButton: {
    position: 'relative',
    zIndex: 1,
    top: 30,
    margin: '0 auto'
  }
}));

function TitleBar({accounts, plaidHandler}) {
  const classes = useStyles();
  return (<AppBar position="static">
    <Toolbar>
      <Typography variant="h5">
        Welcome to Omniscient
      </Typography>
      {
        <Fab onClick={() => {
              plaidHandler.open();
            }} variant="extended" color="secondary" aria-label="add" className={classes.fabButton}>
            <AddIcon/>
            Add Bank
          </Fab>
      }
    </Toolbar>
  </AppBar>)
}

export default TitleBar;
