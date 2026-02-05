
import rateLimit from "express-rate-limit"


const RateLimiter = (limit: number, message?: string) => {
    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000,
        max: limit,
        message: "Too many requests try again later"
        // can add more settings later
    });

    return limiter;
}

export default RateLimiter;