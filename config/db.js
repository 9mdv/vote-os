const mongoose = require('mongoose')

// Map global promises
mongoose.Promise = global.Promise

mongoose
  .connect('mongodb://g11:g11123456@ds213255.mlab.com:13255/pusher-poll', {
    useNewUrlParser: true
  })
  .then(() => {
    console.log('Connected to MongoDB.')
  })
  .catch(err => {
    console.log(err)
  })
