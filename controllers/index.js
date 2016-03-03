var controller = {};

controller.get = (req, res) => {
    res.send('Welcome, The API is at http://localhost:' + req.app.get('port') + '/api');
}

module.exports = controller;

   