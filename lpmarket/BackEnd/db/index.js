const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/lpmarket', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("Our database is connected"))
.catch((err) => console.log(err));


