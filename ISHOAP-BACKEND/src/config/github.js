import passport from 'passport';
import jwt from 'jsonwebtoken';
import userModel from '../feature/User/user.schema.js';
import { Strategy as GitHubStrategy } from 'passport-github2';
import axios from 'axios';
import NotFoundError from '../../Error/notFound.error.js';

const jwtcode = process.env.JWT_SECRET_KEY_CODE;

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:8000/user/auth/github/callback",
    scope: ['user:email']
},


async function (accessToken, refreshToken, profile, done) {
    try {

        let user;
        let email = null;

        // Check if email is available in the profile
        if (profile.emails && profile.emails.length > 0) {
            email = profile.emails[0].value;
        } else {
            // If email is not provided, fetch it from GitHub API
            const emailResponse = await axios.get('https://api.github.com/user/emails', {
                headers: {
                    Authorization: `token ${accessToken}`
                }
            });
            const emails = emailResponse.data;
            
            if (emails && emails.length > 0) {
                email = emails.find(emailObj => emailObj.primary && emailObj.verified)?.email || emails[0].email;
            }
        }

        if (!email) {
            throw new NotFoundError("Email is required to register");
        }

        user = await userModel.findOne({ email: email });

        if (!user) {
            user = new userModel({
                name: {
                    firstName: profile.name ? profile.name.givenName : profile.username,
                    lastName: profile.name ? profile.name.familyName : ''
                },
                email: email,
                password: '@NitinSingh74620',
                mobile: '',
                gender: '',
                dateOfBirth: ''
            });
            await user.save();
        }

        const token = jwt.sign(
            {
                userId: user.id,
                email: user.email,
                name: user.name
            },
            jwtcode,
            {
                expiresIn: '4h'
            }
        );

        return done(null, { user, token });

    } catch (error) {
        if(error  instanceof NotFoundError){
            return done(null, false, { redirect: 'http://localhost:3000/login', message: error.message });
        }
        return done(error);
    }
}
));
