import User from '../models/UserSchema.js'
import Doctor from '../models/DoctorSchema.js'
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs'

const generateToken = (user) => {
    return jwt.sign({id: user.id, role: user.role}, process.env.JWT_SECRET_KEY, { expiresIn: '1d' })
}

export const register = async (req, res) => {
    const { email, password, name, role, photo, gender} = req.body
    try {
        let user = null;

        // check if user already exist
        if (role === 'patient') {
            user = await User.findOne({ email });
        } else if (role === 'doctor') {
            user = await Doctor.findOne({ email })
        }

        // return a response if user already exsit
        if (user) return res.status(400).json({ message: 'User already exist' })

        // if not user, create a password hash and store data in the database
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt)

        const userInput = {
            name,
            email,
            password: hashPassword,
            photo,
            gender,
            role
        }

        if(role === 'patient') {
            user = new User(userInput)
        }

        if(role === 'doctor') {
            user = new Doctor(userInput)
        }

        await user.save()
        
        res.status(200).json({ success: true, message: 'User successfully created' })
    } catch (error) {
        res.status(500).json({ success: true, message: 'Internal server error, Try again'})
    }
}

export const login = async (req, res) => {
    const { email } = req.body
    try {
        let user = null;

        const patient = await User.findOne({ email })
        const doctor = await Doctor.findOne({ email })

        // check if user does not exist
        if (patient) user = patient
        if (doctor) user = doctor

        if (!user) return res.status(404).json({ success: false, message: 'User does not exist' })

        // if user exist, compare the user password and the hashedpassword from db
        const isPasswordMatch = bcrypt.compare(req.body.password, user.password);
        if(!isPasswordMatch) return res.status(400).json({ success: false, message: 'Invalid Credentials' })
            // if the credential is correct, we generate a jwt access token to allow user access other resources
        const token = generateToken(user)

        const { password, role, appointments, ...rest } = user.toJSON()

        return res.status(200).json({
            status: true,
            message: 'Successfully login',
            token,
            data: rest,
            role
        })

        
    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: false, message: 'Unable to login'})
    }
}

