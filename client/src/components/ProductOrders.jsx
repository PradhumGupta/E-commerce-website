import { motion } from 'framer-motion';
import {
  MoreVerticalIcon,
  EyeIcon,
  EditIcon,
  Trash2Icon,
  PackageIcon // Icon for product
} from 'lucide-react';

// Dummy Data for Product Orders
const dummyProductOrders = [
  {
    id: 'ORD001',
    user: 'Alice Smith',
    productName: 'Wireless Headphones',
    quantity: 1,
    price: 120.00,
    purchasedAt: '2024-06-19 14:30',
  },
  {
    id: 'ORD003',
    user: 'Charlie Brown',
    productName: 'Smartwatch',
    quantity: 1,
    price: 250.00,
    purchasedAt: '2024-06-17 18:00',
  },
  {
    id: 'ORD004',
    user: 'Diana Prince',
    productName: 'Ergonomic Keyboard',
    quantity: 1,
    price: 85.50,
    purchasedAt: '2024-06-16 11:45',
  },
  {
    id: 'ORD006',
    user: 'Frank White',
    productName: 'Portable Bluetooth Speaker',
    quantity: 2,
    price: 60.00,
    purchasedAt: '2024-06-14 10:00',
  },
];

function ProductOrders({ sectionVariants }) {
  // Action handlers (dummy for now)
  const handleView = (orderId) => {
    console.log(`View product order: ${orderId}`);
  };

  const handleEdit = (orderId) => {
    console.log(`Edit product order: ${orderId}`);
  };

  const handleDelete = (orderId) => {
    console.log(`Delete product order: ${orderId}`);
  };

  return (
    <motion.div variants={sectionVariants} initial="hidden" animate="visible" className="overflow-x-auto">
      <h3 className="text-2xl font-bold mb-4 flex items-center gap-2 text-base-content">
        <PackageIcon className="size-6 text-primary" /> Product Orders
      </h3>
      <table className="table w-full table-zebra rounded-box">
        {/* Table Head */}
        <thead>
          <tr className="bg-base-300 text-base-content">
            <th className="rounded-tl-lg">Order ID</th>
            <th>User</th>
            <th>Product</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Purchased At</th>
            <th className="rounded-tr-lg text-center">Actions</th>
          </tr>
        </thead>
        {/* Table Body */}
        <tbody>
          {dummyProductOrders.length > 0 ? (
            dummyProductOrders.map(order => (
              <tr key={order.id} className="text-base-content/90">
                <td>{order.id}</td>
                <td>{order.user}</td>
                <td>{order.productName}</td>
                <td>{order.quantity}</td>
                <td>${order.price.toFixed(2)}</td>
                <td>{order.purchasedAt}</td>
                <td className='text-center'>
                  {/* Action Menu (Dropdown) */}
                  <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-xs">
                      <MoreVerticalIcon className="size-4" />
                    </div>
                    <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-32 border border-base-content/10">
                      <li>
                        <a onClick={() => handleView(order.id)} className="flex items-center gap-2 text-base-content/80 hover:text-primary">
                          <EyeIcon className="size-4" /> View
                        </a>
                      </li>
                      <li>
                        <a onClick={() => handleEdit(order.id)} className="flex items-center gap-2 text-base-content/80 hover:text-warning">
                          <EditIcon className="size-4" /> Edit
                        </a>
                      </li>
                      <li>
                        <a onClick={() => handleDelete(order.id)} className="flex items-center gap-2 text-base-content/80 hover:text-error">
                          <Trash2Icon className="size-4" /> Delete
                        </a>
                      </li>
                    </ul>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center py-8 text-base-content/70">
                No product orders found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </motion.div>
  );
}

export default ProductOrders;
