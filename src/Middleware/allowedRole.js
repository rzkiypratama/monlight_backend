module.exports = (allowedRole) =>  {
  return (req, res, next) => {
    const payload = req.userPayload;
    const isAllowed = false
    for (let role of allowedRole){
      if(role !== payload.role) continue;
      isAllowed = true;
      break;
    }
    if(!isAllowed) return res.status(303).json({msg: "Forbidden"});
    next();
  }
}