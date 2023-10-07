import './types' // load global types

import loader from './loader'

loader([
  import('./modules/db'),
  import('./modules/telegraf'),
])
  .then(() => console.info('Bot started successfully!'))
  .catch((err) => console.error(err))
