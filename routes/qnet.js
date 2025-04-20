const express = require("express");
const axios = require("axios");
const { parseStringPromise } = require("xml2js");

const router = express.Router();
const SERVICE_KEY = process.env.QNET_KEY;

router.get("/info", async (req, res) => {
  const QNET_URL = "http://openapi.q-net.or.kr/api/service/rest/InquiryQualInfo/getList";

  try {
    const response = await axios.get(QNET_URL, {
      params: {
        serviceKey: SERVICE_KEY,
        seriesCd: req.query.seriesCd || "03",
        pageNo: req.query.pageNo || 1,
        numOfRows: Math.min(Number(req.query.numOfRows) || 3, 20),
      },
      responseType: "text",
    });

    const jsonResult = await parseStringPromise(response.data, {
      explicitArray: false,
      trim: true,
    });

    const header = jsonResult?.response?.header;
    if (header?.resultCode !== "00") {
      throw new Error(`Q-net 응답 실패: ${header?.resultMsg}`);
    }

    let items = jsonResult?.response?.body?.items?.item || [];
    if (!Array.isArray(items)) {
      items = [items];
    }

    res.json(items);
  } catch (error) {
    console.error("Q-net API 오류:", error.code || error.message);
    res.status(500).json({
      error: "Q-net API 요청 실패",
      detail: error.message,
    });
  }
});

module.exports = router;