import React from 'react'
import {Card, CardMedia, CardContent, CardActionArea, Typography} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import {Alert, AlertTitle} from '@material-ui/lab';

function Bank({name, balance, image_url}) {
  return (<Card>
    <CardActionArea>
      <CardContent>
        <Typography align="center" variant="body2" component="h3">
          {name}
        </Typography>
				<Typography align="center" color="secondary" variant="h6" component="h2">
          ${balance}
        </Typography>
      </CardContent>
    </CardActionArea>
  </Card>)
}

export default Bank;
