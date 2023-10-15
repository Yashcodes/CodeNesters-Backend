const UserProfile = require("../models/UserProfile");

module.exports.userProfileController = async (req, res) => {
  const { user, profilePhotoName } = req.body;

  let profilePhotoData = await UserProfile.create({
    user,
    photo: profilePhotoName,
  });

  res.status(200).json({
    profilePhotoData,
  });
};
