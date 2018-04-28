module.exports = {
    secret: process.env.NODE_ENV === 'production' ? 
    process.env.SECRET : '../../jobnut/private/jobnut_private_key.key'
};