import { motion } from 'framer-motion';
import {
  MoreVerticalIcon,
  EyeIcon,
  EditIcon,
  Trash2Icon,
  GiftIcon // Icon for coupon
} from 'lucide-react';

// Dummy Data for Coupon Orders
const dummyCouponOrders = [
  {
    id: 'ORD002',
    user: 'Bob Johnson',
    couponName: '20% Off Electronics',
    code: 'ELECTRO20',
    price: 10.00,
    purchasedAt: '2024-06-18 09:15',
  },
  {
    id: 'ORD005',
    user: 'Eve Adams',
    couponName: 'Free Shipping Voucher',
    code: 'FREESHIP',
    price: 0.00,
    purchasedAt: '2024-06-15 16:20',
  },
];

function CouponOrders({ sectionVariants }) {
  // Action handlers (dummy for now)
  const handleView = (orderId) => {
    console.log(`View coupon order: ${orderId}`);
  };

  const handleEdit = (orderId) => {
    console.log(`Edit coupon order: ${orderId}`);
  };

  const handleDelete = (orderId) => {
    console.log(`Delete coupon order: ${orderId}`);
  };

  return (
    <motion.div variants={sectionVariants} initial="hidden" animate="visible" className="overflow-x-auto">
      <h3 className="text-2xl font-bold mb-4 flex items-center gap-2 text-base-content">
        <GiftIcon className="size-6 text-primary" /> Coupon Orders
      </h3>
      <table className="table w-full table-zebra rounded-box">
        {/* Table Head */}
        <thead>
          <tr className="bg-base-300 text-base-content">
            <th className="rounded-tl-lg">Order ID</th>
            <th>User</th>
            <th>Coupon</th>
            <th>Code</th>
            <th>Price</th>
            <th>Purchased At</th>
            <th className="rounded-tr-lg text-center">Actions</th>
          </tr>
        </thead>
        {/* Table Body */}
        <tbody>
          {dummyCouponOrders.length > 0 ? (
            dummyCouponOrders.map(order => (
              <tr key={order.id} className="text-base-content/90">
                <td>{order.id}</td>
                <td>{order.user}</td>
                <td>{order.couponName}</td>
                <td>{order.code}</td>
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
                No coupon orders found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </motion.div>
  );
}

export default CouponOrders;
