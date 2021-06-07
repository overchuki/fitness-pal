const express = require('express');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const validator = require('validator');
const router = express.Router();
const maxTokenAgeSeconds = 1 * 24 * 60 * 60;

const maxNumOfIcons = 1;

const handleError = (err) => {
    console.log(err.message);
    return err.message;
}

const createJWTToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: maxTokenAgeSeconds });
}

// Log a user in
router.post('/login', async (req, res) => {
    const body = req.body;

    const sql = `
        SELECT *
        FROM user
        WHERE username = ? OR email = ?
    `;

    try{
        const user = await req.conn.queryAsync(sql, [body.user, body.user]);
        
        if(user.length > 0){
            const auth = await bcrypt.compare(body.pass, user[0].password);
            
            if(auth){
                const token = createJWTToken(user[0].id);
                res.cookie('jwt', token, { httpOnly: true, maxAge: maxTokenAgeSeconds * 1000 });
                res.send({ success: 'Login successful.' });
            }else{
                throw Error('Wrong password.');
            }
        }else{
            throw Error('Wrong email or username.');
        }
    }catch(err){
        const errors = handleError(err);
        res.status(400).send({ error: errors });
    }
});

// Sign a user up
router.post('/signup', async (req, res) => {
    const body = req.body;

    const sql = `
        INSERT
        INTO user (
            name,
            username,
            email,
            description,
            password,
            icon_fk)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    try{
        if(body.name.length > 30) throw Error('Name is too long.');
        if(body.username.length > 12) throw Error('Username is too long.');
        if(body.description && body.description.length > 100) throw Error('Description is too long.');
        if(body.password.length < 8) throw Error('Password is too short.');

        if(!validator.isAscii(body.name) ||
           !validator.isAscii(body.username) ||
           (body.description && !validator.isAscii(body.description)) ||
           !validator.isAscii(body.password)){
            throw Error('Please use valid characters only (ASCII).');
        }

        if(body.email && !validator.isEmail(body.email)) throw Error('Invalid email address.');

        if(body.icon_fk > maxNumOfIcons) throw Error('Icon index out of bounds.');
        
        bcrypt.hash(body.password, saltRounds, async (err, hash) => {
            if(err) throw err;
            let password = hash;
            let okPacket = await req.conn.queryAsync(sql, [body.name, body.username, body.email, body.description, password, body.icon_fk]);
            res.send({ success: 'user has been created' });
        });
    }catch(err){
        const errors = handleError(err);
        res.status(400).send({ error: errors });
    }
});

// Check if username/email is already taken
router.post('/checkExisting/:type', async (req, res) => {
    const checkStr = req.body.check;
    const type = req.params.type;

    let validTypes = ['email', 'username'];

    const sql = `
        SELECT *
        FROM user
        WHERE ${type} = ?
    `;

    try{
        if(validTypes.indexOf(type) === -1) throw Error('Invalid check type.');
        
        const user = await req.conn.queryAsync(sql, [checkStr]);
        
        if(user.length > 0){
            res.send({ available: false });
        }else{
            res.send({ available: true });
        }
    }catch(err){
        const errors = handleError(err);
        res.status(400).send({ error: errors });
    }
});

router.use((req, res) => {
    res.status(404).send({ error: 'Requested auth endpoint does not exist.' });
});

module.exports = router;