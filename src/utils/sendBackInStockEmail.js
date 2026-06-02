import resend from "../config/resend.js";

const sendBackInStockEmail = async ({
  email,
  name,
  productTitle,
  size,
  color,
  shopUrl,
}) => {
  try {
    await resend.emails.send({
      from: "Vyoma <onboarding@resend.dev>",
      to: email,
      subject: "Your requested item is back in stock",
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
            font-size: 28px;
            margin-bottom: 16px;
            color: #7C8CFF;
          ">
            Good news!
          </h1>

          <p style="font-size: 16px; color: #555; line-height: 1.8;">
            Hi ${name},
          </p>

          <p style="font-size: 16px; color: #555; line-height: 1.8;">
            The product you requested is now available.
          </p>

          <div style="
            background: #f5f5f5;
            padding: 18px;
            border-radius: 16px;
            margin: 24px 0;
          ">
            <p style="margin: 0 0 8px 0;">
              <strong>Product:</strong> ${productTitle}
            </p>
            <p style="margin: 0 0 8px 0;">
              <strong>Size:</strong> ${size || "-"}
            </p>
            <p style="margin: 0;">
              <strong>Color:</strong> ${color || "-"}
            </p>
          </div>

          <a href="${shopUrl}" style="
            display: inline-block;
            padding: 14px 18px;
            border-radius: 14px;
            background: linear-gradient(90deg, #1356d0, #9A1951, #FA5303);
            color: white;
            text-decoration: none;
            font-weight: bold;
            font-size: 14px;
          ">
            Shop Now
          </a>

          <p style="font-size: 14px; color: #888; margin-top: 28px;">
            Thanks,<br/>Team Vyoma
          </p>
        </div>
      `,
    });
  } catch (error) {
    console.log(error);
  }
};

export default sendBackInStockEmail;

