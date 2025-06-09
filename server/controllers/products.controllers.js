import cloudinary from "../config/cloudinary.js";
import redisClient from "../config/redis.js";
import Product from "../models/product.model.js";

const getProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.json({ products });
    } catch (error) {
        console.log("Error in getProducts controller", error.message);
        res.status(500).json({message:'Server Error', error});
    }
}

const getFeaturedProducts = async (req, res) => {
    try {
        let featuredProducts = await redisClient.get("featured_products");
        if(featuredProducts) {
            return res.json(JSON.parse(featuredProducts));
        }

        // if not in redis. fetch from mongodb
        // .lean() is gonna return a plain javascript object instead of a mongodb document
        // which is good for performance
        featuredProducts = await Product.find({ isFeatured: true }).lean();

        if(!featuredProducts) {
            return res.status(404).json({ message: "No featured products found" });
        }

        // store in redis for future quick access

        await redisClient.set("featured_products", JSON.stringify(featuredProducts));

        res.json(featuredProducts);
    } catch (error) {
        console.log("Error in getFeaturedProducts controller", error.message)
        res.status(500).json({ message: "Server Error", error });
    }
}

const getProduct = async(req, res) => {}

const createProduct = async (req, res) => {
    try {
        const { name, description, price, image, category } = req.body;

        let cloudinaryResponse = null

        if(image) {
            cloudinaryResponse = await cloudinary.uploader.upload(image, { folder: "products" });
        }

        if(!cloudinaryResponse?.secure_url) {
            return res.status(500).json({ error: "Image upload failed" });
        }

        const product = await Product.create({
            name,
            description,
            price,
            image: cloudinaryResponse.secure_url,
            category
        })

        res.status(201).json(product);
    } catch (error) {
        console.log("Error creating product", error.message);
        res.json({ error });
    }
}

const updateProduct = async (req, res) => {}

const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if(product.image) {
            const publicId = product.image.split("/").pop().split(".")[0];
            try {
                await cloudinary.uploader.destroy(`products/${publicId}`)
                console.log("deleted image from cloudinary")
            } catch (error) {
                console.log("Error deleting image from cloudinary", error)
                throw error;
            }
        }

        await Product.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.log("Error in deleteProduct controller ",error.message);
        res.status(500).json({ message: 'Server Error', error });
    }
}


const getRecommendedProducts = async (req, res) => { // error
    try {
        const products = await Product.aggregate([
            {
                $sample: { size: 3 },
            },
            {
                $product: {
                    _id: 1,
                    name: 1,
                    description: 1,
                    image: 1,
                    price: 1
                },
            },
        ]);

        res.json(products);
    } catch (error) {
        console.log("Error in getRecommendedProducts controller", error.message)
        res.status(500).json({ message: 'Server Error', error });
    }
}



const getProductsByCategory = async (req, res) => {
    const { category } = req.params;
    try {
        const products = await Product.find({ category });
        res.json(products);
    } catch (error) {
        console.log("Error in getProductsByCategory controller", error.message)
        res.status(500).json({ message: 'Server Error', error });
    }
}


const toggleFeaturedProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if(product) {
            product.isFeatured = !product.isFeatured;
            const updatedProduct = await product.save();
            await updateFeaturedProductsCache();
            res.json(updatedProduct);
        } else {
            return res.status(404).json({ message: 'Product not found' });
        }

    } catch (error) {
        console.log("Error in toggleFeaturedProduct controller", error.message)
        res.status(500).json({ message: 'Server Error', error });
    }
}

async function updateFeaturedProductsCache() {
    try {
        const featuredProducts = await Product.find({ isFeatured: true }).lean();
        await redisClient.set("featured_products", JSON.stringify(featuredProducts));
    } catch (error) {
        console.log("Error in update cache function", error)
    }
}


export { getProduct, getProducts, createProduct, updateProduct, deleteProduct, getFeaturedProducts, getRecommendedProducts, getProductsByCategory, toggleFeaturedProduct };