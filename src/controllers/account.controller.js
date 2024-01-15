import User from '../models/User.js';
import uploadImage from '../services/cloudinary.js';


export const uploadProfilePicture = async (req, res) => {
  try {

    const email = req.user;

    const foundUser = await User.findOne({ email });
    if (!foundUser) return res.status(403).json({ message: "Unauthorized." });

    const image = req.body.image;
    if (!image) return res.status(400).json({ message: "No image was provided." });
    const imageUrl = await uploadImage(image);

    foundUser.imgaeUrl = imageUrl;
    await foundUser.save();

    res.json({ message: "User image uploaded successfully.", imageUrl });

  } catch (error) {
    console.log(error);
  }
};



