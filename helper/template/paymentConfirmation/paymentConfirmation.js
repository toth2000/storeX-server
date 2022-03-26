const paymentSuccessTemplate = (order) => {
  const firstName = order.address.firstName;
  const orderId = order._id;
  const transactionId = order.razorpayOrderId;
  const paymentId = order.razorpayPaymentId;
  const amount = order.amount;

  return `
    <!DOCTYPE html>
    <htmll>
        <head>
            <title>Email Template</title>
            <style>
                .heading{
                    font-size: 38px;
                    text-align: center;
                    font-weight: 300;
                }

                .container{
                  padding: 20px;
                }

                .text{
                    font-size: 24px;
                }

                .detail{
                    display: block
                }
            </style>
        </head>

        <body>
            <div class="container">
                <h2 class="heading">Payment Successful</h2>
                <p class="text">
                Hi, ${firstName}. 
                </p>
                <p class="text">
                    Payment of INR ${amount} has been successfully received.
                </p>
                <h3>Payment Details</h3>
                <span class="detail">Order Id: ${orderId}</span>
                <span class="detail">Transaction Id: ${transactionId}</span>
                <span class="detail">Payment Id: ${paymentId}</span>
                <span class="detail">Total Amount Paid: ${amount}</span>

                <p class="text">Thank you for shopping with us!</p>
            </div>
        </body>
    </htmll> 
    `;
};

module.exports = paymentSuccessTemplate;
