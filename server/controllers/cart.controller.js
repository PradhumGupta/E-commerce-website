import Product from "../models/product.model.js";

export const getCartProducts = async (req, res) => { // item is undefined for 6842f8076c9231928af737c9 leading to error
    try {
        const cartItems = req.user.cartItems;

        const productIds = cartItems.map(item => item.product);
        const products = await Product.find({ _id: { $in: productIds } });

        const cartWithQuantity = products.map(product => {
            const item = cartItems.find(ci => ci.product.toString() === product._id.toString());
            return {
                ...product.toJSON(),
                quantity: item.quantity,
                price: item.quantity * product.price
            };
        });

        res.json(cartWithQuantity);
    } catch (error) {
        console.log("Error in getCartProducts controller", error.message);
        res.status(500).json({ message: 'Server Error', error });
    }
}

export const addToCart = async (req, res) => {
    try {
        const { productId } = req.body;
        const user = req.user;

        if(!productId) {
            return res.status(400).json({ message: "ProductId not found" })
        }

        const productPrice = await Product.findById(productId).select("price");

        if(!productPrice) {
            return res.status(404).json({ message: "Product not found" });
        }

        const existingItem = user.cartItems.find(item => item.product.toString() === productId);
        
        if(existingItem) {
            existingItem.quantity += 1;
            existingItem.price = existingItem.quantity * productPrice;
        } else {
            user.cartItems.push({ product: productId, quantity: 1, price });
        }

        await user.save();
        res.json(user.cartItems);

    } catch (error) {
        console.log("Error in addToCart controller", error.message);
        res.status(500).json({ message: 'Server Error', error });
    }
}

export const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.body;
        const user = req.user;

        if(!productId) {
            user.cartItems = [];
        } else {
            user.cartItems = user.cartItems.filter(item => item.product.toString() !== productId);
        }
        
        await user.save();
        res.json(user.cartItems);

    } catch (error) {
        console.log("Error in removeFromCart controller", error.message);
        res.status(500).json({ message: 'Server Error', error });
    }
}

export const updateCartItemQuantity = async (req, res) => {
    try {
        const { productId, quantity, price } = req.body;
        const user = req.user;

        const existingItem = user.cartItems.find(item => item.product.toString() === productId);
        
        if(existingItem) {
            if(quantity === 0) {
                user.cartItems = user.cartItems.filter((item) => item.product.toString() !== productId);
            } else {
                existingItem.quantity = quantity;
                existingItem.price = quantity * price;
            }

            await user.save();
            res.json(user.cartItems);
        } else {
            return res.status(404).json({ message: 'product not found in cart' });
        }

    } catch (error) {
        console.log("Error in updateCartItemQuantity controller", error.message);
        res.status(500).json({ message: 'Server Error', error });
    }
}