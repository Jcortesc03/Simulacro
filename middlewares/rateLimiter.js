import rateLimit from 'express-rate-limit';

const limiter = rateLimit({ 
    windowsMs: 15 * 60 * 1000,
    max: 100,
    message: 'Muchas peticiones por segundo. Por favor intente después.',
});

export default limiter;