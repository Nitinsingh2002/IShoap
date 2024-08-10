import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import jwt from 'jsonwebtoken';
import userModel from '../feature/User/user.schema.js';



const jwtcode = process.env.JWT_SECRET_KEY_CODE;

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:8000/user/auth/google/callback",
  },
    async function (accessToken, refreshToken, profile, cb) {
      try {
        let user = await userModel.findOne({ email: profile.emails[0].value });
  
        if (!user) {
          // Create a new user if not found
          user = new userModel({
            name: {
              firstName: profile.name.givenName,
              lastName: profile.name.familyName
            },
            email: profile.emails[0].value,
            password: '@NitinSingh74620',
            mobile: profile.phoneNumbers ? profile.phoneNumbers[0].value : '',
            gender: profile.gender || '',
            dateOfBirth: profile.birthday || ''
          });
          await user.save();
        }
  
        // Generate JWT token only once after user is identified
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
  
        return cb(null, { user, token });
      } catch (error) {
        return cb(error);
      }
    }
  ));
  

