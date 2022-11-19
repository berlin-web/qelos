import {mongoUri} from './config'
import {connect} from './server/models';

// connect to the database and load models
connect(mongoUri)

// load passport strategies
import './server/passport'
import './server/routes'

// start the server
require('@qelos/api-kit')
      .start(
          'Authentication Service',
          process.env.PORT || 9000,
          process.env.IP || '0.0.0.0'
      )
