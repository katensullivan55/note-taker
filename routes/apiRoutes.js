const router = require('express').Router();
const { noteCreateNew } = require('../notes');
const  notesNew  = require('../db.json');
const  UUID  = require('../uuid')


router.get('/notes', (req, res) => {
  let results = notesNew ;
  if (results) {
    res.json(results);
  } else {
    res.send(404);
  }
});
// uuid npm package
router.post('/notes', (req, res) => {
  req.body.id = UUID();
    const notes = noteCreateNew(req.body, notesNew);
    res.json(notes);
  
});

module.exports = router;