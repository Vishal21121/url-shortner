import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { User } from './models/user.models';
import { UserLoginType } from './constants';

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://www.example.com/auth/google/callback"
},
    async function (accessToken, refreshToken, profile, next) {
        // User.findOrCreate({ googleId: profile.id }, function (err, user) {
        //     return cb(err, user);
        // });
        const user = await User.findOne({ email: profile._json.email })
        if (user) {
            if (user.loginType !== UserLoginType.GOOGLE) {
                //TODO: use custom error throw
                // next(err,null)
            } else {
                next(null, user)
            }
        } else {
            //TODO: CREATE ACCOUNT
        }
    }
));