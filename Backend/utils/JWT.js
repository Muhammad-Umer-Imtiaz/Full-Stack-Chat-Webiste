import jwt from 'jsonwebtoken'

export const generateToken = async (userId, res)=>{
    const token = jwt.sign({userId},process.env.SECRETKEY,{
        expiresIn:"7d"
    })
    res.cookie("token",token,{
        maxAge : 7*24*60*60*1000,
        httpOnly : true,
        sameSite:"strict",
        secure : process.env.NODE_ENV !== "development"
    })
    return token;
}