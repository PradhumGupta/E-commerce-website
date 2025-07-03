import React from 'react'

function OrderSummary() {
  return (
    <div className="card bg-base-100 shadow-lg border border-base-content/10 p-6 rounded-box flex-shrink-0">
                <h2 className="card-title text-2xl font-bold text-base-content mb-4 flex items-center gap-2">
                  <ReceiptTextIcon className="size-6 text-primary" /> Order Summary
                </h2>
                <ul className="space-y-3 text-base-content/80 text-lg">
                  <li className="flex justify-between items-center">
                    <span>Subtotal:</span>
                    <span className="font-semibold">${orderSummary.subtotal.toFixed(2)}</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span>Shipping:</span>
                    <span className="font-semibold">{orderSummary.shipping === 0 ? 'Free' : `$${orderSummary.shipping.toFixed(2)}`}</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span>Tax (8%):</span>
                    <span className="font-semibold">${orderSummary.tax.toFixed(2)}</span>
                  </li>
                  {couponApplied && (
                    <li className="flex justify-between items-center text-success">
                      <span>Coupon Discount:</span>
                      <span className="font-semibold">-10%</span>
                    </li>
                  )}
                  <li className="flex justify-between items-center border-t border-base-content/20 pt-3 text-xl font-bold text-base-content">
                    <span>Total:</span>
                    <span className="text-accent">${finalTotal.toFixed(2)}</span>
                  </li>
                </ul>
              </div>
  )
}

export default OrderSummary