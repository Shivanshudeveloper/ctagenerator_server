const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.SECRET_KEY;

const generateUserToken = async (req, res) => {

    // Sample payload
    const payload = {
        id: 12345, 
        username: 'john_doe',
        email: 'test@gmail.com'
    };

    // Sign the payload and generate a token
    const token = jwt.sign(payload, SECRET_KEY);

    res.status(200).json({ status: true, apiKey: token });
}

module.exports = {
    generateUserToken
}