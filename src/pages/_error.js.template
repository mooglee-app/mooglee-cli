import React from 'react';


function Error() {
  return (
    <p>
      {
        this.props.statusCode
          ? `An error ${this.props.statusCode} occurred on server`
          : 'An error occurred on client'
      }
      {
        !!this.props.message &&
        <p>{this.props.message}</p>
      }
    </p>
  );
}

Error.getInitialProps = function ({ res, err }) {
  const statusCode = res ? res.statusCode : err ? err.statusCode : null;
  return { statusCode };
}

export default Error;
