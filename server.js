const app = require('./src/app');
const { PORT } = require('./src/v1/configs/app');

app.listen(PORT, () => {
    console.log('Server running at port: ', PORT);
});
