const express = require('express');
const router = express.Router();
const journalController = require('../controllers/journalController');
const { optionalAuth } = require('../middleware/auth');

router.post('/', optionalAuth, journalController.createEntry);
router.get('/', optionalAuth, journalController.getEntries);
router.get('/:id', optionalAuth, journalController.getEntryById);
router.put('/:id', optionalAuth, journalController.updateEntry);
router.delete('/:id', optionalAuth, journalController.deleteEntry);

module.exports = router;
