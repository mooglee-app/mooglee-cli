import Grid        from '@material-ui/core/Grid';
import Typography  from '@material-ui/core/Typography';
import React       from 'react';
import Layout      from '<<<PAGE_LAYOUT_RELATIVE_PATH>>>';
import pageWrapper from '<<<WRAPPER_RELATIVE_PATH>>>';


const styles = theme => ({});

class <<<PAGE_COMPONENT_NAME>>> extends React.Component {
  render () {
    const { pageData, classes } = this.props;

    return (
      <Layout pageData={pageData}>

      </Layout>
    );
  };
}


export default pageWrapper(<<<PAGE_COMPONENT_NAME>>>, {
  name: '<<<PAGE_NAME>>>',
  styles,
  <<<PAGE_OPTIONS>>>
});
