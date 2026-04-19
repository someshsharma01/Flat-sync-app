const Listing = require('../models/Listing');
const { streamUpload } = require('../utils/cloudinaryUpload');

const createListing = async (req, res) => {
  try {
    const { fullName, email, mobileNumber, address, age, aboutYourself, vacancyCount, lat, lng } = req.body;
    let photoUrl = '';

    if (req.file) {
      const result = await streamUpload(req.file.buffer);
      photoUrl = result.secure_url;
    }

    const listing = await Listing.create({
      owner: req.user._id,
      photoUrl,
      fullName,
      email,
      mobileNumber,
      address,
      age,
      aboutYourself,
      vacancyCount,
      location: {
        type: 'Point',
        coordinates: [parseFloat(lng), parseFloat(lat)]
      }
    });

    res.status(201).json(listing);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getListings = async (req, res) => {
  try {
    const { lat, lng } = req.query;
    if (!lat || !lng) {
      const listings = await Listing.find().populate('owner', 'name photoUrl preferences');
      return res.json(listings);
    }

    const listings = await Listing.aggregate([
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          distanceField: 'dist.calculated',
          spherical: true
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'owner',
          foreignField: '_id',
          as: 'owner'
        }
      },
      {
        $unwind: '$owner'
      }
    ]);

    res.json(listings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getListingById = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate('owner', '-password');
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    res.json(listing);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    if (listing.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const { fullName, email, mobileNumber, address, age, aboutYourself, vacancyCount, lat, lng } = req.body;
    
    if (req.file) {
      const result = await streamUpload(req.file.buffer);
      listing.photoUrl = result.secure_url;
    }

    listing.fullName = fullName || listing.fullName;
    listing.email = email || listing.email;
    listing.mobileNumber = mobileNumber || listing.mobileNumber;
    listing.address = address || listing.address;
    listing.age = age || listing.age;
    listing.aboutYourself = aboutYourself || listing.aboutYourself;
    listing.vacancyCount = vacancyCount || listing.vacancyCount;
    
    if (lat && lng) {
      listing.location = {
        type: 'Point',
        coordinates: [parseFloat(lng), parseFloat(lat)]
      };
    }

    const updatedListing = await listing.save();
    res.json(updatedListing);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    if (listing.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await listing.deleteOne();
    res.json({ message: 'Listing removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getMyListings = async (req, res) => {
  try {
    const listings = await Listing.find({ owner: req.user._id });
    res.json(listings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { createListing, getListings, getListingById, updateListing, deleteListing, getMyListings };
