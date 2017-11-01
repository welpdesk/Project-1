const express = require('express');
const path = require('path');
const logger = require('morgan');
const app = express();

const userRouter = require('./routes/userRouter')


app.use(logger('dev'));

app.use('/applications', userRouter);

app.get('/', (req, res) => {
    res.status(200).send('Hello WelpDesk')
});

app.use('*', (req, res) => {
    res.status(404).send('Invalid route!');
});

const PORT = process.env.PORT || 1234;
app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});
