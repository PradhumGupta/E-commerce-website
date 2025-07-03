import React from "react";

const itemVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", damping: 15, stiffness: 100 },
  },
};

function CartItem({ item }) {

    
  const handleQuantityChange = (id, delta) => {
    
  };

  const handleRemoveItem = (id) => {
  };
  return (
    <motion.div
      key={item.id}
      className="card card-compact bg-base-100 shadow-lg border border-base-content/10 p-4 flex flex-row items-center gap-4"
      variants={itemVariants}
    >
      <figure className="w-20 h-20 overflow-hidden rounded-md flex-shrink-0">
        <img
          src={item.image}
          alt={item.productName}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://placehold.co/80x80/CCCCCC/000000?text=Item";
          }}
        />
      </figure>
      <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h3 className="text-lg font-semibold text-base-content">
            {item.productName}
          </h3>
          <p className="text-base-content/70 text-sm">
            Price: ${item.price.toFixed(2)}
          </p>
        </div>
        <div className="flex items-center gap-4 mt-2 sm:mt-0">
          <div className="join border border-base-content/20 rounded-md">
            <button
              className="btn btn-ghost btn-xs join-item"
              onClick={() => handleQuantityChange(item.id, -1)}
              disabled={item.quantity <= 1}
            >
              <MinusIcon className="size-4" />
            </button>
            <span className="join-item btn btn-ghost btn-xs pointer-events-none">
              {item.quantity}
            </span>
            <button
              className="btn btn-ghost btn-xs join-item"
              onClick={() => handleQuantityChange(item.id, 1)}
            >
              <PlusIcon className="size-4" />
            </button>
          </div>
          <span className="text-lg font-bold text-accent">
            ${(item.price * item.quantity).toFixed(2)}
          </span>
          <button
            className="btn btn-circle btn-ghost btn-sm text-error hover:bg-error/10"
            onClick={() => handleRemoveItem(item.id)}
          >
            <Trash2Icon className="size-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default CartItem;
