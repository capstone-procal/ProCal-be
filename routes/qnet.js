const express = require("express");
const axios = require("axios");
const router = express.Router();


const SERVICE_KEY = process.env.QNET_KEY;

router.get("/info", async (req, res) => {
  try {
    const response = await axios.get("http://openapi.q-net.or.kr/api/service/rest/InquiryQualInfo/getList", {
      params: {
        serviceKey: SERVICE_KEY,
        seriesCd: req.query.seriesCd || "03",
        numOfRows: req.query.numOfRows || 10,
        pageNo: req.query.pageNo || 1,
      },
      responseType: "text",
    });

    res.send(response.data);
  } catch (error) {
    console.error("Q-net API 오류:", error.message);
    res.status(500).json({ error: "Q-net API 요청 실패" });
  }
});

module.exports = router;