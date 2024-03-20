import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from "passport-github2"
import { User } from '../models/user.models.js';
import { UserLoginType } from '../constants.js';
import { ApiError } from '../utils/ApiError.js';
import passport from "passport";
import dotenv from "dotenv"

dotenv.config()

try {
    // we have to serialize and deserialize user as we are using session
    passport.serializeUser((user, next) => {
        next(null, user._id);
    });

    passport.deserializeUser(async (id, next) => {
        try {
            const user = await User.findById(id);
            if (user) next(null, user); // return user of exist
            else next(new ApiError(404, "User does not exist"), null); // throw an error if user does not exist
        } catch (error) {
            next(
                new ApiError(
                    500,
                    "Something went wrong while deserializing the user. Error: " + error
                ),
                null
            );
        }
    });

    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL
    },
        async function (accessToken, refreshToken, profile, next) {
            const user = await User.findOne({ email: profile._json.email })
            if (user) {
                if (user.loginType !== UserLoginType.GOOGLE) {
                    //TODO: use custom error throw
                    next(
                        new ApiError(
                            400,
                            "You have previously registered using " +
                            user.loginType?.toLowerCase()?.split("_").join(" ") +
                            ". Please use the " +
                            user.loginType?.toLowerCase()?.split("_").join(" ") +
                            " login option to access your account."
                        )
                        , null)
                } else {
                    next(null, user)
                }
            } else {
                // CREATE ACCOUNT
                const createdUser = await User.create({
                    email: profile._json.email,
                    password: profile._json.sub,
                    username: profile._json.email?.split("@")[0],
                    loginType: UserLoginType.GOOGLE
                })
                if (createdUser) {
                    next(null, createdUser);
                } else {
                    next(new ApiError(500, "Error while registering the user"), null);
                }
            }
        }
    ));

    passport.use(
        new GitHubStrategy(
            {
                clientID: process.env.GITHUB_CLIENT_ID,
                clientSecret: process.env.GITHUB_CLIENT_SECRET,
                callbackURL: process.env.GITHUB_CALLBACK_URL,
            },
            async (_, __, profile, next) => {
                const user = await User.findOne({ email: profile._json.email });
                if (user) {
                    if (user.loginType !== UserLoginType.GITHUB) {
                        next(
                            new ApiError(
                                400,
                                "You have previously registered using " +
                                user.loginType?.toLowerCase()?.split("_").join(" ") +
                                ". Please use the " +
                                user.loginType?.toLowerCase()?.split("_").join(" ") +
                                " login option to access your account."
                            ),
                            null
                        );
                    } else {
                        next(null, user);
                    }
                } else {
                    if (!profile._json.email) {
                        next(
                            new ApiError(
                                400,
                                "User does not have a public email associated with their account. Please try another login method"
                            ),
                            null
                        );
                    } else {
                        // check of user with username same as github profile username already exist
                        const userNameExist = await User.findOne({
                            username: profile?.username,
                        });

                        const createdUser = await User.create({
                            email: profile._json.email,
                            password: profile._json.node_id, // password is redundant for the SSO
                            username: userNameExist
                                ? // if username already exist, set the emails first half as the username
                                profile._json.email?.split("@")[0]
                                : profile?.username,
                            loginType: UserLoginType.GITHUB,
                        });
                        if (createdUser) {
                            next(null, createdUser);
                        } else {
                            next(new ApiError(500, "Error while registering the user"), null);
                        }
                    }
                }
            }
        )
    );
} catch (error) {
    console.error("PASSPORT ERROR: ", error);
}