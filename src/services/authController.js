// services/authController.js
const { requestMessage, verifyMessage, registerUser } = require('./authService');

exports.request = async (req, res, next) => {
    try {
        const { address, chain, networkType } = req.body;
        const message = await requestMessage({ address, chain, networkType });
        res.status(200).json({ message });
    } catch (err) {
        console.log(err);
        next(err);
    }
};

exports.verify = async (req, res, next) => {
    try {
        const { networkType, message, signature } = req.body;
        const result = await verifyMessage({ networkType, message, signature });

        if (result.needsRegistration) {
            console.log("reached this point");
            return res.status(200).json({ needsRegistration: true, authData: result.authData });
        }

        res.status(200).json({ user: result.user, token: result.token });
    } catch (err) {
        console.error(err);  // Log the error
        next(err);
    }
};

exports.register = async (req, res, next) => {
    try {
        const { authData, role, name, email } = req.body;
        const result = await registerUser(authData, role, name, email);
        res.status(200).json({ user: result.user, token: result.token });
    } catch (err) {
        console.error(err);  // Log the error
        next(err);
    }
};
