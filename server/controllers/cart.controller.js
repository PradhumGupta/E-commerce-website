import Product from "../models/product.model.js";

export const getCartProducts = async (req, res) => {
    try {
        const products = await Product.find({ _id: { $in: req.user.cartItems } });

        // add quantity for each product
        const cartItems = products.map(product => {
            const item = req.user.cartItems.find(cartItem => cartItem.id === product.id);
            return {...product.toJSON(), quantity: item.quantity};
        })

        res.json(cartItems);
    } catch (error) {
        console.log("Error in getCartProducts controller", error.message);
        res.status(500).json({ message: 'Server Error', error });
    }
}

export const addToCart = async (req, res) => {
    try {
        const { productId } = req.body;
        const user = req.user;

        const existingItem = user.cartItems.find(item => item.id === productId);
        
        if(existingItem) {
            existingItem.quantity += 1;
        } else {
            user.cartItems.push(productId);
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
            user.cartItems = user.cartItems.filter(item => itemId !== productId);
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
        const { productId, quantity } = req.body;
        const user = req.user;

        const existingItem = user.cartItems.find(item => item.id === productId);
        
        if(existingItem) {
            if(quantity === 0) {
                user.cartItems = user.cartItems.filter((item) => item.id !== productId);
            } else {
                existingItem.quantity = quantity;
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