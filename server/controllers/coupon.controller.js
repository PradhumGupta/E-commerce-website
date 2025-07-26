import Coupon from "../models/coupon.model.js";
import Product from "../models/product.model.js";
import stripe from "../config/stripe.js";
import cloudinary from "../config/cloudinary.js";

export const getCoupon = async (req, res) => {
    const couponId = req.params.id;
    try {
        const coupon = await Coupon.findOne({ _id: couponId, isActive: true })
        res.json(coupon || null);
    } catch (error) {
        console.log("Error in getCoupon controller", error.message);
        res.status(500).json({ message: 'Server Error', error });
    }
}


// --- ADMIN CONTROLLERS ---

// @desc    Create a new coupon
// @route   POST /api/admin/coupons
// @access  Admin

export const createCoupon = async (req, res) => {
    const { title, description, image, price, totalCodes, discountType, discountValue, minOrderAmount, category } = req.body;

    let cloudinaryResponse = null

    if (image) {
        cloudinaryResponse = await cloudinary.uploader.upload(image, { folder: "coupons" });
    }

    if (!cloudinaryResponse?.secure_url) {
        return res.status(500).json({ error: "Image upload failed" });
    }

    try {
        const newCoupon = new Coupon({
            title,
            description,
            image: cloudinaryResponse.secure_url,
            isFree: +price === 0,
            price,
            discountType,
            discountValue,
            minOrderAmount,
            category,
            expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Default to 30 days from now
        });

        if(newCoupon.isFree) {
            newCoupon.usageLimitPerUser = 1
        }

        if(newCoupon.discountType === 'percent') {
            this.maxDiscountAmount = minOrderAmount * discountValue/100;
        }

        const generateCodes = async function(totalCodes, length = 8) {
            const codes = new Set();
            while(codes.size < totalCodes) {
                const couponCode = Math.random().toString(36).substr(2, length).toUpperCase();
                const existingCoupon = await Coupon.findOne({ "codes.code": couponCode });

                if(!existingCoupon) codes.add(couponCode);
            }
            return Array.from(codes).map((code) => ({
                code,
                user: null,
                used: false,
                reservedAt: null
            }));
        };

        newCoupon.codes = await generateCodes(totalCodes)

        await newCoupon.save();

        res.status(201).json({ message: "coupon created successfully", coupon: newCoupon });
    } catch (error) {
        console.log("Error in creating coupon", error.message);
        res.status(500).json({ message: "Server error", error })
    }
}


// @desc    Get all coupons
// @route   GET /api/admin/coupons
// @access  Admin

export const getAllCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find().sort({ createdAt: -1 }).lean();
        
        coupons.forEach((coupon) => {
            coupon.codes = coupon.codes.length;
            coupon.purchasedBy = coupon.purchasedBy.length;
        })
        res.status(200).json(coupons);
    } catch (err) {
        console.error("Error getting coupons:", err);
        res.status(500).json({ message: "Server error" });
    }
    // const activeCoupons = await Coupon.find({ isActive: true, validUntil: { $gte: new Date() } });
    // console.log('Active and valid coupons:', activeCoupons);
}

// @desc    Get a single coupon by ID
// @route   GET /api/admin/coupons/:id
// @access  Admin

export const getCouponById = async (req, res) => {
    try {
        const coupon = await Coupon.findById(req.params.id);
        if (!coupon) {
            return res.status(404).json({ message: 'Coupon not found' });
        }
        res.status(200).json(coupon);
    } catch (error) {
        console.error('Error fetching coupon by ID:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update a coupon by ID
// @route   PUT /api/admin/coupons/:id
// @access  Admin

export const updateCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, {
            new: true, // Return the updated document
            runValidators: true // Run schema validators on update
        });
        if (!coupon) {
            return res.status(404).json({ message: 'Coupon not found' });
        }
        res.status(200).json({ message: 'Coupon updated successfully', coupon });
    } catch (error) {
        console.error('Error updating coupon:', error);
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a coupon by ID
// @route   DELETE /api/admin/coupons/:id
// @access  Admin

export const deleteCoupon = async (req, res) => {
    try {
        const deleted = await Coupon.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ message: "Coupon not found" });
        }
        return res.status(200).json({ message: "Coupon deleted" });
    } catch (error) {
        console.error("Error deleting coupon:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

// --- USER CONTROLLERS ---

// @desc    Get all coupons owned by the authenticated user
// @route   GET /api/user/coupons
// @access  User

export const getUserOwnedCoupon = async (req, res) => {
    const user = req.user;
    console.log(user._id)
    try {
        const coupons = await Coupon.find().select("-codes -purchasedBy");
        const userCoupons = coupons.map((coupon) => {
            const ownedCoupon = user.ownedCoupons.find(c => c.coupon.toString() === coupon._id.toString());
            if(!ownedCoupon) return null;
            return { ...coupon.toJSON(), code: ownedCoupon.code };
        }).filter(Boolean);

        return res.status(200).json(userCoupons);
    } catch (err) {
        console.error("Error fetching user's coupons:", err);
        return res.status(500).json({ message: "Server error" });
    }
};


// @desc    Apply a coupon during checkout (validation and calculation)
// @route   POST /api/coupons/apply
// @access  User

export const applyCoupon = async (req, res) => {
    const { couponCode, currentOrderTotal } = req.body;
    const userId = req.user._id;

    if(!couponCode || !currentOrderTotal) {
        return res.status(400).json({ message: 'Coupon code and current order total are required.' });
    }

    try {
        const coupon = await Coupon.findOne({ "codes.code": couponCode.toUpperCase() });

        if(!coupon) {
            return res.status(404).json({ message: "Coupon not found" });
        }

        const { isValid, message } = await validateCouponApplicability(coupon, couponCode, req.user, currentOrderTotal);
            
        if(!isValid) {
            return res.status(400).json({ message });
        }

        let discountAmount = 0;
        if(coupon.discountType === 'percentage') {
            discountAmount = currentOrderTotal * coupon.discountValue / 100;
            if(discountAmount > coupon.maxDiscountAmount) {
                discountAmount = coupon.maxDiscountAmount;
            }
        } else {
            discountAmount = coupon.discountValue;
            if(discountAmount > currentOrderTotal) {
                discountAmount = currentOrderTotal;
            }
        }

        const { codes, purchasedBy, ...couponData } = coupon.toJSON();

        res.status(200).json({
            message: "Coupon applied successfully!",
            appliedCoupon: {...couponData, code: couponCode},
            discountAmount: parseFloat(discountAmount.toFixed(2)),
            newOrderTotal: parseFloat((currentOrderTotal - discountAmount).toFixed(2))
        })
    
    } catch (error) {
        console.log('Error applying coupon', error.message)
        res.status(500).json({ message: "Coupon application failed due to server error", error })
    }
}


const validateCouponApplicability = async (coupon, code, user, currentOrderTotal) => {
    const now = Date.now();

    if (!coupon.isActive || coupon.expiryDate < now) {
        return { isValid: false, message: `Coupon is inactive or expired.` };
    }

    const couponCodeDoc = await coupon.codes.find((c) => c.code === code);

    if (!couponCodeDoc || couponCodeDoc.user.toString() !== user._id.toString() || couponCodeDoc.used) {
        return { isValid: false, message: "Invalid or used coupon code" };
    }

    if (coupon.minOrderAmount > currentOrderTotal) {
        return { isValid: false, message: `Minimum order amount of ${coupon.minOrderAmount} not met` }
    }

    const products = await Product.find({ _id: { $in: user.cartItems.map((item) => item.product) } });

    const subTotal = user.cartItems
        .filter((item) => {
            const product = products.find((p) => p._id.toString() === item.product.toString());
            return product && product.category === coupon.category
        })
        .reduce((acc, item) => acc + item.total, 0);

    if (subTotal < coupon.minOrderAmount) {
        return { isValid: false, message: `Minimum order amount of $${coupon.minOrderAmount} not met by ${coupon.category} products` }
    }

    return { isValid: true, message: 'Coupon is valid' }
}


export const claimFreeCoupon = async (req, res) => {
    try {
        
    const { couponId } = req.body;
    const user = req.user;

    const coupon = await Coupon.findById(couponId);

    if (!coupon.isFree) {
        return res.status(400).json({ message: "This coupon is not free" });
    }

    const isExist = await user.ownedCoupons.find(c => c.coupon.toString() === couponId) ? true : false;

    if(isExist) return res.status(400).json({ message: "This coupon is already claimed" });

    const availableCode = coupon.codes.find(c => c.user === null);
    
    if (!availableCode)
        return res.status(400).json({ message: "No available codes" });

    availableCode.user = user._id;
    availableCode.reservedAt = new Date();

    await coupon.save();

    user.ownedCoupons.push({
        coupon: couponId,
        code: availableCode.code,
        purchasedAt: new Date(),
        isFree: true
    });

    await user.save();

    const claimedCoupon = coupon.$clone().toJSON({ transform: (doc, ret) => { delete ret.codes; delete ret.purchasedBy; return ret; } });

    claimedCoupon.code = availableCode.code;

    return res.json({
        message: "Coupon purchased successfully",
        coupon: claimedCoupon
    })
 } catch (error) {
        console.log("Error in claimCoupon controller", error)
        res.status(500).json({ message: "Internal Server error at claim coupon", error: error.message})
    }
}