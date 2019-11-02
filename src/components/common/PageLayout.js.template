import { Container }     from '@material-ui/core';
import MoogleePageLayout from '@mooglee/core/components/PageLayout';
import wrapper           from '@mooglee/core/wrappers/componentWrapper';
import React             from 'react';


function PageLayout({ classes, children, ...rest }) {
  return (
    <MoogleePageLayout {...rest}>
      <Container className={classes.container} fixed>
        {children}
      </Container>
    </MoogleePageLayout>
  );
}


export default wrapper(PageLayout);
