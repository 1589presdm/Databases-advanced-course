import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { logonUsers, findOneUser } from '../mongodb.js'; 

let router = Router();

router.post('/', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    let user = await findOneUser(username);

    if (user && user.password === password) {
        const token = jwt.sign({ username: user.username }, 'my_secret_key', {
            expiresIn: '1h'
        });

        logonUsers.set(username, { ...user, token: token });

        res.json({
            'username': username,
            'access_token': token,
            'token_type': 'Bearer',
            'expires_in': '1h'
        });
    } else {
        res.status(401).json({ "error": "Login failed" });
    }
});

export default router;