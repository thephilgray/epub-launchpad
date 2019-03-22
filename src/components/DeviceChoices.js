import React from 'react';
import Grid from '@material-ui/core/Grid';
import Device105 from '../10-5.png';
import Typography from '@material-ui/core/Typography';
import AppleiPadProSpaceGray from '../AppleiPadProSpaceGray.png';
import AppleiPhone7PlusRoseGold from '../AppleiPhone7PlusRoseGold.png';

const DeviceChoices = () => {
  return (
    <Grid container spacing={40} alignItems="flex-end">
      <Grid item xs={6}>
        <img src={AppleiPadProSpaceGray} alt="" style={{ maxWidth: '75%' }} />
        <Typography variant="h4" color="secondary">
          4:3
        </Typography>
      </Grid>
      {/* <Grid item xs={4}>
        <img src={Device105} alt="" style={{ maxWidth: '75%' }} />
        <Typography variant="h4" color="secondary">
          8:5
        </Typography>
      </Grid> */}
      <Grid item xs={6}>
        <img
          src={AppleiPhone7PlusRoseGold}
          alt=""
          style={{ maxWidth: '75%' }}
        />
        <Typography variant="h4" color="secondary">
          16:9
        </Typography>
      </Grid>
    </Grid>
  );
};

export default DeviceChoices;
