import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import User from "../models/user.model.js"

export const getAnalyticsData = async () => {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();

    const salesData = await Order.aggregate([
        {
            $group: {
                _id: null,
                totalSales: { $sum:1 },
                totalRevenue: { $sum: "$totalAmount"}
            }
        }
    ])

    const { totalSales, totalRevenue } = salesData[0] || { totalSales: 0, totalRevenue: 0 };

    return {
        users: totalUsers,
        products: totalProducts,
        totalSales,
        totalRevenue
    }
}


export const getDailySalesData = async (startDate, endDate) => {
    try {
    const dailySalesData = await Order.aggregate([
        {
            $match: {
                createdAt: {
                    $gte: startDate,
                    $lte: endDate,
                },
            },
        },
        {
            $group: {
                _id: {
                    $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
                },
                totalSales: { $sum: 1 },
                totalRevenue: { $sum: "$totalAmount" }
            },
        },
        { $sort: { _id: 1 } },
    ]);

    // example of dailySalesData
    // [
    //     { _id: '2023-10-01', sales: 5, revenue: 100 },
    // ]

    const dateArray = getDatesInRange(startDate, endDate);

    return dateArray.map(date => {
        const salesData = dailySalesData.find(data => data._id === date);
        return {
            date,
            sales: salesData?.sales || 0,
            revenue: salesData?.revenue || 0
        };
    });
} catch (error) {
    throw error;
}
}

function getDatesInRange(startDate, endDate) {
    const dates = [];
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
        dates.push(currentDate.toISOString().split('T')[0]); // Format as YYYY-MM-DD
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
}