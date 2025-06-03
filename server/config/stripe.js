import Stripe from "stripe";
import { STRIPE_SECRET_KEY } from "./env.js";

const stripe = new Stripe(STRIPE_SECRET_KEY);

export default stripe;