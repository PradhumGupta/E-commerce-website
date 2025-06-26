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
      className="card bg-base-100 shadow-xl border border-base-content/10 rounded-xl transition-transform duration-300 hover:scale-[1.02] hover:shadow-2xl"
      variants={itemVariants} // Apply initial and animate variants
      initial="hidden"
      animate="visible"
      whileHover={{ y: -5 }} // Subtle lift animation on hover
    >
      <figure className="h-48 overflow-hidden cursor-pointer">
          <img
            src={category.image}
            alt={category.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
          />
      </figure>
      <div className="p-4">
        <h2 className="text-2xl font-bold text-primary">{category.name}</h2>
        <p className="text-base-content/80">{category.description}</p>
      </div>
    </motion.div>
  );
}

export default CategoryItem;
