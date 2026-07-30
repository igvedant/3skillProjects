import Property from '../models/Property.js';

// @desc    Get all properties with advanced filters, search, and sorting
// @route   GET /api/properties
export const getProperties = async (req, res, next) => {
  try {
    const {
      city,
      minPrice,
      maxPrice,
      propertyType,
      listingType,
      bedrooms,
      bathrooms,
      amenities,
      featured,
      search,
      sort
    } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { 'location.city': { $regex: search, $options: 'i' } },
        { 'location.address': { $regex: search, $options: 'i' } }
      ];
    }

    if (city && city !== 'All') {
      query['location.city'] = { $regex: city, $options: 'i' };
    }

    if (listingType && listingType !== 'all') {
      query.listingType = listingType;
    }

    if (propertyType && propertyType !== 'all') {
      query.propertyType = propertyType;
    }

    if (bedrooms && bedrooms !== 'any') {
      query['specs.bedrooms'] = { $gte: Number(bedrooms) };
    }

    if (bathrooms && bathrooms !== 'any') {
      query['specs.bathrooms'] = { $gte: Number(bathrooms) };
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (featured === 'true') {
      query.featured = true;
    }

    if (amenities) {
      const amenityArray = Array.isArray(amenities) ? amenities : amenities.split(',');
      if (amenityArray.length > 0) {
        query.amenities = { $all: amenityArray };
      }
    }

    let sortOptions = { createdAt: -1 };
    if (sort === 'price_asc') sortOptions = { price: 1 };
    else if (sort === 'price_desc') sortOptions = { price: -1 };
    else if (sort === 'sqft_desc') sortOptions = { 'specs.sqft': -1 };

    const properties = await Property.find(query).sort(sortOptions);

    res.json({
      success: true,
      count: properties.length,
      data: properties
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single property details
// @route   GET /api/properties/:id
export const getPropertyById = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }
    res.json({ success: true, data: property });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new property listing
// @route   POST /api/properties
export const createProperty = async (req, res, next) => {
  try {
    const propertyData = {
      ...req.body,
      createdBy: req.user ? req.user._id : null
    };

    const property = await Property.create(propertyData);
    res.status(201).json({ success: true, data: property });
  } catch (error) {
    next(error);
  }
};

// @desc    Update property listing
// @route   PUT /api/properties/:id
export const updateProperty = async (req, res, next) => {
  try {
    let property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    property = await Property.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({ success: true, data: property });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete property listing
// @route   DELETE /api/properties/:id
export const deleteProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    await property.deleteOne();
    res.json({ success: true, message: 'Property listing deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard statistics for admin
// @route   GET /api/properties/stats/overview
export const getPropertyStats = async (req, res, next) => {
  try {
    const totalProperties = await Property.countDocuments();
    const activeProperties = await Property.countDocuments({ 'specs.status': 'active' });
    const featuredProperties = await Property.countDocuments({ featured: true });

    const totalValueAgg = await Property.aggregate([
      { $group: { _id: null, totalVal: { $sum: '$price' }, avgPrice: { $avg: '$price' } } }
    ]);

    const totalValue = totalValueAgg.length ? totalValueAgg[0].totalVal : 0;
    const avgPrice = totalValueAgg.length ? totalValueAgg[0].avgPrice : 0;

    res.json({
      success: true,
      data: {
        totalProperties,
        activeProperties,
        featuredProperties,
        totalValue,
        avgPrice: Math.round(avgPrice)
      }
    });
  } catch (error) {
    next(error);
  }
};
