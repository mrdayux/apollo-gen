import express from 'express';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        return res.send(true);
    } catch (error) {
        return res.status(500).send(error);
    }
});

export default router;
