import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

function CategoryItem({ category }) {
  // Framer Motion variants for the item's appearance animation
  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 }
  };

  return (
    <motion.div
      className="card card-compact bg-base-100 shadow-xl border border-base-content/10 transition-transform duration-300 hover:scale-[1.02] hover:shadow-2xl"
      variants={itemVariants} // Apply initial and animate variants
      initial="hidden"
      animate="visible"
      whileHover={{ y: -5 }} // Subtle lift animation on hover
    >
      <figure className="h-48 overflow-hidden">
        {/* Conditional rendering for the image. If category.image exists, display it.
            Otherwise, show a placeholder. */}
        {category.image ? (
          <img
            src={category.image}
            alt={category.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-base-300 flex items-center justify-center text-base-content/50 text-xl font-bold">
            No Image
          </div>
        )}
      </figure>
      <div className="card-body">
        <h2 className="card-title text-2xl font-bold text-primary">{category.name}</h2>
        <p className="text-base-content/80">{category.description}</p>
        <div className="card-actions justify-end mt-4">
          <Link to={category.link} className="btn btn-secondary btn-sm px-6 font-semibold">
            Shop Now
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default CategoryItem;
