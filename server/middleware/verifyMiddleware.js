const { ethers } = require("ethers");

// 签名验证中间件
const signatureVerificationMiddleware = async (req, res, next) => {
  try {
    const { signature, address } = req.body;

    // 验证签名
    const recoveredAddress = ethers.verifyMessage(
      process.env.SIGN_MESSAGE,
      signature
    );

    // 将用户的地址转换为以太坊地址格式
    const formattedAddress = ethers.getAddress(address);

    // 验证签名是否成功
    if (recoveredAddress !== formattedAddress) {
      throw new Error("Recovered address does not match provided address");
    }

    // // 签名验证成功，将验证结果存储到请求对象中
    req.signatureVerified = true;

    // 继续请求处理
    next();
  } catch (error) {
    // 签名验证失败，返回错误响应
    console.error("Signature verification failed:", error);
    res.status(401).json({ error: "Unauthorized" });
  }
};

module.exports = { signatureVerificationMiddleware };
