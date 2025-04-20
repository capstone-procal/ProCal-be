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
        numOfRows: req.query.numOfRows || 3,
      },
      responseType: "text",
    });

    if (response.data.startsWith("<!DOCTYPE html")) {
      throw new Error("Q-net 서버에서 HTML 에러 페이지가 응답됨");
    }

    const jsonResult = await parseStringPromise(response.data, {
      explicitArray: false,
      trim: true,
    });

    const items = jsonResult?.response?.body?.items?.item || [];

    res.json(items);
  } catch (error) {
    console.error("Q-net API 오류:", error.message || error.code);

    res.status(500).json({
      error: "Q-net API 요청 실패",
      detail: error.message || "알 수 없는 오류",
    });
  }
});

module.exports = router;