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

const getProduct = async(req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error });
    }
}

const createProduct = async (req, res) => {
    try {
        const { name, description, price, image, category } = req.body;

        let cloudinaryResponse = null

        if(image) {
            await cloudinary.uploader.upload(image, { folder: "products" })
        }

        const product = await Product.create({
            name,
            description,
            price,
            image: cloudinaryResponse?.secure_url ? cloudinaryResponse.secure_url : "",
            category
        })

        res.status(201).json(product);
    } catch (error) {
        
    }
}

const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, price, image_url } = req.body;
    try {
        const result = await pool.query(
            'UPDATE products SET name = $1, price = $2, image_url = $3 WHERE id = $4 RETURNING *',
            [name, price, image_url, id] 
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error });
    }
}

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


const getRecommendedProducts = async (req, res) => {
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