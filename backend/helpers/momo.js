import axios from "axios";
import crypto from "crypto";

export const createMoMoPayment = async (order, totalAmount) => {
  const partnerCode = "MOMO";
  const accessKey = "F8BBA842ECF85";
  const secretkey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
  const requestId = partnerCode + new Date().getTime();
  const orderId = `${order._id.toString()}_${Date.now()}`;
  const orderInfo = `Thanh toan don hang ${order._id.toString()}`;

  const redirectUrl = `${process.env.CLIENT_URL}/order-success/${order._id.toString()}`;
  const ipnUrl = "http://localhost:3000/api/v1/order/momo-callback";
  const amount = totalAmount;
  const requestType = "payWithMethod";
  const extraData = "";

  const rawSignature =
    "accessKey=" +
    accessKey +
    "&amount=" +
    amount +
    "&extraData=" +
    extraData +
    "&ipnUrl=" +
    ipnUrl +
    "&orderId=" +
    orderId +
    "&orderInfo=" +
    orderInfo +
    "&partnerCode=" +
    partnerCode +
    "&redirectUrl=" +
    redirectUrl +
    "&requestId=" +
    requestId +
    "&requestType=" +
    requestType;

  const signature = crypto
    .createHmac("sha256", secretkey)
    .update(rawSignature)
    .digest("hex");

  const requestBody = JSON.stringify({
    partnerCode,
    accessKey,
    requestId,
    amount,
    orderId,
    orderInfo,
    redirectUrl,
    ipnUrl,
    extraData,
    requestType,
    signature,
    lang: "vi",
  });

  try {
    const momoResponse = await axios.post(
      `https://test-payment.momo.vn/v2/gateway/api/create`,
      requestBody,
      {
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(requestBody),
        },
      },
    );

    return momoResponse.data;
  } catch (error) {
    console.error("Lỗi kết nối cổng MoMo:", error);
  }
};
