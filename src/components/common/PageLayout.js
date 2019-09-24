import { Container }     from '@material-ui/core';
import MoogleePageLayout from '@mooglee/core/components/PageLayout';
import wrapper           from '@mooglee/core/helpers/componentWrapper';
import React             from 'react';
import Header            from './Header';


const styles = theme => ({
  root: {},
});



class PageLayout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }


  render() {
    const { classes, ...rest } = this.props;

    return (
      <MoogleePageLayout Header={<Header/>} {...rest}>
        <Container className={classes.container} fixed>
          {this.props.children}
        </Container>
      </MoogleePageLayout>
    );
  }
}



export default wrapper(PageLayout, {
  styles,
});