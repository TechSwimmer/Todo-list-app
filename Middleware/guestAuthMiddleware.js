const Guest = require('../modals/guest-modal');

const guestAuthMiddleware = async (req,res,next) => {
  try{
    const guestID = req.header("Guest-ID") || req.body.guestID;           // retrieve from frontend headers
    if(!guestID) return res.status(401).json({msg: "No guest ID provided"});

     // Check if guest exists in the database
    const guest = await Guest.findOne({ guestID });
    if (!guest) {
      return res.status(401).json({ msg: `Invalid guest ID: ${guestID}` });
    }

    req.guest = guest;
    next();
  }
  catch(error) {
    console.error("Guest authentication error:", error);
    res.status(500).json({ msg: "Server error" });
  }
  }



  module.exports = guestAuthMiddleware;