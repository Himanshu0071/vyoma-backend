import resend from "../config/resend.js";

const sendOrderEmail =
  async ({
    email,

    name,

    orderId,

    totalPrice,
  }) => {
    try {
      await resend.emails.send({
        from:
          "Vyoma <onboarding@resend.dev>",

        to: email,

        subject:
          "Your Vyoma Order Confirmation",

        html: `
          <div style="
            font-family: Arial;
            max-width: 600px;
            margin: auto;
            padding: 40px;
            background: #ffffff;
            border-radius: 20px;
          ">

            <h1 style="
              font-size: 32px;
              margin-bottom: 20px;
              color: #7C8CFF;
            ">
              Thank you for your order!
            </h1>

            <p style="
              font-size: 16px;
              color: #555;
            ">
              Hi ${name},
            </p>

            <p style="
              font-size: 16px;
              color: #555;
              line-height: 1.8;
            ">
              Your payment was successful and your order has been placed successfully.
            </p>

            <div style="
              background: #f5f5f5;
              padding: 20px;
              border-radius: 16px;
              margin: 30px 0;
            ">

              <p>
                <strong>Order ID:</strong>
                ${orderId}
              </p>

              <p>
                <strong>Total:</strong>
                ₹${totalPrice}
              </p>
            </div>

            <p style="
              font-size: 15px;
              color: #888;
              margin-top: 40px;
            ">
              Thank you for shopping with Vyoma.
            </p>
          </div>
        `,
      });
    } catch (error) {
      console.log(error);
    }
  };

export default sendOrderEmail;