import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt as JwtExtract } from "passport-jwt";
import {COOKIE_SECRTA} from "../server.js"

export function initializePassport() {
    passport.use(
      "jwt",
      new JwtStrategy(
        {
          secretOrKey: COOKIE_SECRTA,
          jwtFromRequest: JwtExtract.fromExtractors([cookieExtractor]),
        },
        (payload, done) => {
          try {
            console.log(payload);
  
            if (payload.email !== "admin@gmail.com") {
              return done(null, false, { messages: "Invalid credentials" });
            }
  
            return done(null, payload);
          } catch (error) {
            done(error);
          }
        }
      )
    );
  }

  function cookieExtractor(req) {
    return req.cookies.token ? req.cookies.token : null;
  }
