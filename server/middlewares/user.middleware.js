import jwt from "jsonwebtoken"


const isAthenicated = async (req, res, next) => {
     try {
        const token = req.cookies.token
    if(!token){
        return res.status(401).json({message: "Unauthorized"})

    }

    const decode = await jwt.verify(token, process.env.JWT_SECRET )
    if(!decode){
        return res.status(401).json({message: "Invalid Token"})
    }

    req.id = decode.userId
    // console.log(decode)
    // console.log(req.id)
    next()
     } catch (error) {
        console.log("Error in isAthenicated Middleware", error);
     }
}

export default isAthenicated