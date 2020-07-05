module.exports = router => {
    router.route('/api/v2/shoodoo-status')
      .get(function (req, res) {
        res.render('index.html');
      });
};