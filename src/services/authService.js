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
        .select()
        .single();

    if (!user) {
        return { needsRegistration: true, authData };
    }

    const token = jwt.sign(
        {
            ...user,
            aud: 'authenticated',
            role: user.role,
            name: user.name,
            moralis_provider_id: authData.profileId,
            exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
        },
        process.env.JWT_SECRET
    );

    return { user, token };
};

// get authData
exports.getAuthData = async ({ networkType, message, signature }) => {
    console.log("reached authService getAuthData");
    const result = await Moralis.Auth.verify({ networkType, signature, message });
    console.log(result.toJSON());
    return result.toJSON();
};

exports.registerUser = async (authData, role, name, email) => {
    console.log(authData);
    console.log(role);
    console.log(name);
    console.log(email);

    // Check if user already exists
    const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('*')
        .eq('moralis_provider_id', authData.profileId)
        .select()
        .single();

    if (existingUser) {
        throw new Error('User with this account already exists.');
    }

    // Insert new user
    const { data: user, error: insertError } = await supabase
        .from('users')
        .insert({
            moralis_provider_id: authData.profileId,
            metadata: authData,
            role: role,
            name: name,
            email: email,
        })
        .select() // Ensure the inserted data is returned
        .single();

    if (insertError) {
        throw new Error(insertError.message);
    }

    console.log("User inserted:", user);

    const token = jwt.sign(
        {
            ...user,
            aud: 'authenticated',
            role: user.role,
            name: user.name,
            moralis_provider_id: authData.profileId,
            exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
        },
        process.env.JWT_SECRET
    );

    return { user, token };
};