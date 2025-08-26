import express from 'express';
import { reportController } from '../controllers/report.controller';

const router = express.Router();

router.get('/most-borrowed', reportController.mostBorrowedBooks.bind(reportController));
router.get('/active-members', reportController.activeMembers.bind(reportController));
router.get('/book-availability', reportController.bookAvailability.bind(reportController));

export default router;
