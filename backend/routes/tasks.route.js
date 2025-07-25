import express from 'express';
import {
  createTasks,
  deleteTasks,
 
  getAllTasks,
 
  getTasks,
  getTaskStats,
  updateTasks
} from '../controllers/tasks.controllers.js';

import { authenticateUser, authorizeRole } from '../middleware/authMiddleware.js';

const router = express.Router();

router
  .route("/create")
  .post(authenticateUser, authorizeRole("user", "manager"), createTasks);

router
  .route("/")
  .get(authenticateUser, authorizeRole("user", "manager"), getTasks);

router
  .route("/update/:id")
  .put(authenticateUser, authorizeRole("user", "manager"), updateTasks);

router
  .route("/delete/:id")
  .delete(authenticateUser, authorizeRole("user", "manager"), deleteTasks);

router.route("/stats").get(authenticateUser, authorizeRole("user", "manager"),getTaskStats);

router.route("/tasks").get(authenticateUser, getAllTasks);





export default router;
