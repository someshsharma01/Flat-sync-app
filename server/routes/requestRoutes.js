const express = require('express');
const router = express.Router();
const { sendRequest, getIncomingRequests, getOutgoingRequests, updateRequestStatus } = require('../controllers/requestController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/send', protect, sendRequest);
router.get('/incoming', protect, getIncomingRequests);
router.get('/outgoing', protect, getOutgoingRequests);
router.put('/:id/accept', protect, (req, res, next) => { req.body = req.body || {}; req.body.status = 'accepted'; next(); }, updateRequestStatus);
router.put('/:id/reject', protect, (req, res, next) => { req.body = req.body || {}; req.body.status = 'rejected'; next(); }, updateRequestStatus);

module.exports = router;
