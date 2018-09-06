import express from 'express';
import apiTest from './api_test';

const router = express.Router();

router.use('/api_test', apiTest);

export default router;
