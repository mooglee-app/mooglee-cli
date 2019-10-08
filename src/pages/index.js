import Grid        from '@material-ui/core/Grid';
import Typography  from '@material-ui/core/Typography';
import React       from 'react';
import Layout      from '../components/common/PageLayout';
import LazyImage   from '@mooglee/core/components/LazyImage';
import pageWrapper from '@mooglee/core/wrappers/pageWrapper';


const styles = theme => ({
  title: {
    marginTop: theme.spacing(8),
  },
});

function Home ({ classes[%PAGE_DATA_RENDER_DEFINITION%] }) {
  return (
    <Layout[%PAGE_DATA_LAYOUT_DEFINITION%]>
      <Grid container justify="center">
        <Grid item md={6}>
          <Typography variant="h1" className={classes.title} align="center">Welcome to your mooglee app ! :)</Typography>
        </Grid>
      </Grid>
    </Layout>
  );
}


export default pageWrapper(Home, {
  name: 'home',
  styles,
});
