import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";

import {
  CRow,
  CCol,
  CWidgetStatsA,
} from "@coreui/react";
import { getStyle } from "@coreui/utils";
import CIcon from "@coreui/icons-react";
import {
  cilIndustry,
  cilGraph,
  cilDoubleQuoteSansRight,
  cilFork,
  cilSettings,
} from "@coreui/icons";
import { getPortalDashBoardCount } from "../../service/AllVendorAPI";

const WidgetsDropdown = (props) => {
  const widgetChartRef1 = useRef(null);
  const widgetChartRef2 = useRef(null);
  const [loader, setLoader] = useState(false);
  const [data, setData] = useState();

  const getData = async () => {
    const role = sessionStorage.getItem("role");
    const pkUserId = sessionStorage.getItem("pkUserId");
    const token = sessionStorage.getItem("token");

    if (!role || !pkUserId || !token) {
      console.error("Missing session data. Cannot make API call.");
      return;
    }

    try {
      setLoader(true);
      const result = await getPortalDashBoardCount(0, role, pkUserId);
      console.log("dashboard Details", result);
      setData(result?.data);
    } catch (error) {
      console.error("Error fetching company details:", error);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    document.documentElement.addEventListener("ColorSchemeChange", () => {
      if (widgetChartRef1.current) {
        setTimeout(() => {
          widgetChartRef1.current.data.datasets[0].pointBackgroundColor =
            getStyle("--cui-primary");
          widgetChartRef1.current.update();
        });
      }

      if (widgetChartRef2.current) {
        setTimeout(() => {
          widgetChartRef2.current.data.datasets[0].pointBackgroundColor =
            getStyle("--cui-info");
          widgetChartRef2.current.update();
        });
      }
    });
  }, [widgetChartRef1, widgetChartRef2]);

  return (
    <CRow className={props.className} xs={{ gutter: 4 }}>
        <CCol sm={6} xl={4} xxl={3}>
          <CWidgetStatsA
            color="primary"
            title={null}
            value={
              data ? (
                <>
                  <h6 className="fw-bold">{`Company Count`}</h6>
                  <span>{data.companyCount || 0}</span>
                  <div className="d-flex gap-2">
                    <h6>Day -</h6>
                    <span className="fs-6 fw-normal">
                      {data.dayCount || 0}{" , "}
                    </span>
                    <h6>Month -</h6>
                    <span className="fs-6 fw-normal">
                      {data.monthCount || 0}{" , "}
                    </span>
                    <h6>Year -</h6>
                    <span className="fs-6 fw-normal">{data.yearCount || 0}</span>
                  </div>
                </>
              ) : (
                <span>Loading...</span>
              )
            }
            action={<CIcon icon={cilIndustry} size="xl" />}
          />
        </CCol>

        <CCol sm={6} xl={4} xxl={3}>
          <CWidgetStatsA
            color="info"
            value={
              data ? (
              <div>
                <h6 className="fw-bold">{`Product Promotion`}</h6>
                <span className="fs-6 fw-normal">{data.productPromotion}</span>{" "}
              </div>
              ) : (
                <span>Loading...</span>
              )
            }
            title={null}
            action={<CIcon icon={cilGraph} />}
          />
        </CCol>

        <CCol sm={6} xl={4} xxl={3}>
          <CWidgetStatsA
            color="warning"
            value={
              data ? (
              <div>
                <h6 className="fw-bold">{`Product Count`}</h6>
                <span className="fs-6 fw-normal">{data.productCount}</span>{" "}
              </div>
              ) : (
                <span>Loading...</span>
              )
            }
            title={null}
            action={<CIcon icon={cilDoubleQuoteSansRight} />}
          />
        </CCol>

        <CCol sm={6} xl={4} xxl={3}>
          <CWidgetStatsA
            color="danger"
            value={
              data ? (
              <div>
                <h6 className="fw-bold">{`Service Count`}</h6>
                <span className="fs-6 fw-normal">{data.serviceCount}</span>{" "}
              </div>
              ) : (
                <span>Loading...</span>
              )
            }
            title={null}
            action={<CIcon icon={cilFork} />}
          />
        </CCol>

        <CCol sm={6} xl={4} xxl={3}>
          <CWidgetStatsA
            color="success"
            value={
              data ? (
              <div>
                <h6 className="fw-bold">{`Infra Count`}</h6>
                <span className="fs-6 fw-normal">{data.infraCount}</span>{" "}
              </div>
              ) : (
                <span>Loading...</span>
              )
            }
            title={null}
            action={<CIcon icon={cilSettings} size="xl" />}
          />
        </CCol>
    </CRow>
  );
};

WidgetsDropdown.propTypes = {
  className: PropTypes.string,
  withCharts: PropTypes.bool,
};

export default WidgetsDropdown;
