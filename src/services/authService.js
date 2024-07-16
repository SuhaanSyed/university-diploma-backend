// services/authService.js
const Moralis = require('moralis').default;
const supabase = require('../utils/supabaseClient');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const STATEMENT = 'Please sign this message to confirm your identity.';
const EXPIRATION_TIME = 900000;
const TIMEOUT = 15;

exports.requestMessage = async ({ address, chain, networkType }) => {
    const now = new Date();
    const expirationTime = new Date(now.getTime() + EXPIRATION_TIME);

    const result = await Moralis.Auth.requestMessage({
        address,
        chain,
        networkType,
        domain: 'your-domain.com',
        statement: STATEMENT,
        uri: 'https://your-domain.com',
        notBefore: now.toISOString(),
        expirationTime: expirationTime.toISOString(),
        timeout: TIMEOUT,
    });

    return result.toJSON().message;
};

exports.verifyMessage = async ({ networkType, signature, message }) => {
    const result = await Moralis.Auth.verify({ networkType, signature, message });
    const authData = result.toJSON();

    let { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('moralis_provider_id', authData.profileId)
        .single();

    if (!user) {
        return { needsRegistration: true, authData };
    }

    const token = jwt.sign(
        {
            ...user,
            aud: 'authenticated',
            role: user.role,
            exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
        },
        process.env.JWT_SECRET
    );

    return { user, token };
};

exports.registerUser = async (authData, role, name, email) => {
    const response = await supabase
        .from('users')
        .insert({
            moralis_provider_id: authData.profileId,
            metadata: authData,
            role,
            name,
            email,
        })
        .single();

    const user = response.data;

    const token = jwt.sign(
        {
            ...user,
            aud: 'authenticated',
            role: user.role,
            exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
        },
        process.env.JWT_SECRET
    );

    return { user, token };
};
