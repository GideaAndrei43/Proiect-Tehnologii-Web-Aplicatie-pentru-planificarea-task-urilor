const jwt=require("jsonwebtoken");

module.exports=function(req,res,next){
  const token=req.header("x-auth-token");
  if(!token) return res.status(401).send("Acces Interzis VERE!");

  try{
    const decoded=jwt.verify(token,"secret123");
    req.user=decoded;
    next();
  } catch{
    res.status(400).send("TOKEN INVALID VERE!");
  }
};