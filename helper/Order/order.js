const Product = require("../../models/Product");

const getOrderDateAndTime = (order) => {
  if (order === null) return;

  const date = new Date(order.createdAt);
  const dateAndTime = date.toString().split(" GMT");

  return dateAndTime[0];
};

const getAddress = (order) => {
  if (!order) return "";

  let address = order.address.address1;

  if (order.address.address2)
    address = address.concat(`, ${order.address.address2}`);
  if (order.address.address3)
    address = address.concat(`, ${order.address.address3}\n`);
  if (order.address.landmark)
    address = address.concat(`, ${order.address.landmark}`);
  if (order.address.locality)
    address = address.concat(`, ${order.address.locality}`);

  address = address.concat(`,\n${order.address.city}`);
  address = address.concat(`, ${order.address.state}`);
  address = address.concat(`, ${order.address.pincode}`);

  return address;
};

const getAllProductsDetails = async (products) => {
  try {
    let productList = [];

    await Promise.all(
      products.map(async (item) => {
        const data = await Product.findById(item.productId);
        const { image, title } = data._doc;
        const { quantity, color, size, amount } = item;
        const product = { image, title, quantity, color, size, amount };
        productList = [...productList, product];
      })
    );

    return productList;
  } catch (err) {
    console.log("Error getting products details", err);
  }
};

module.exports = { getOrderDateAndTime, getAddress, getAllProductsDetails };
