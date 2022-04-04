const User = require("../model/user");
const VerificationToken = require("../model/verificationToken");
const { sendError } = require("../utils/helper");

const jwt = require('jsonwebtoken');
const { generateOTP } = require("../utils/mail");

exports.createUser = async (req, res) => {
    const {name, email, phonenumber, password} = req.body;

    const emailCheck = await User.findOne({ email });
    const phoneCheck = await User.findOne({ phonenumber });

    if (emailCheck)
    {
        return sendError (res, 'This email already exists!');
    }
    else if (phoneCheck)
    {
        return sendError (res, 'This phonenumber already exists!');
    }
    
    const newUser = new User({
        name ,
        email ,
        phonenumber,
        password
    });

    const OTP = generateOTP();
  
    const verificationToken = new VerificationToken({
        owner: newUser._id,
        token: OTP
    });
    
    await verificationToken.save();
    await newUser.save();

    mailTransport().sendMail({
        from: "emailverification@email.com",
        to: newUser.email,
        subject: "Verify your Email Account",
        html: `<h1>${OTP}</h1>`,

    });

    res.send(newUser);
};

exports.signin = async (req, res) => {
    const {email, password} = req.body;

    if(!email.trim() || password.trim()) return sendError(res, "Email/Password missing!");

    const user = await User.findOne({email})

    if (!user)
        return sendError(res, "User not found!");

    const isMatched = await user.comparePassword(password);

    if (!isMatched)
        return sendError(res, "Email/Password does not match!");

    const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET, {
        expiresIn: '1d'
    })

    res.json({success: true, user: {name: user.name, email: user.email, id: user._id, token: token }})
};