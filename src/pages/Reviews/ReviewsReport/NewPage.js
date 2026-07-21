import React from "react";
import "./styles.scss";
import Heading from "./Heading";
import PageNumber from "./PageNumber";
import GoalsTable from "../GoalsTable";
import { t } from "i18next";
export default function NewPage({ report, pageNumber }) {
    return (
        <div className="container new-page-container">
            <div className="bg-white mt-3 mb-3" style={{ height: 'fit-content' }}>
                <Heading fullname={report.fullname} />
                <div>
                    <h1 className="head-1 mt-5 mb-3">{t("ReviewsReport.OKR's Rating and Overall Rating")}</h1>
                    <div className="container" style={{ height: 'auto', marginTop: '50px' }}>
                        <GoalsTable
                            setDataWeights={(data) => { }}
                            setDataQ1={(data) => { }}
                            setDataQ2={(data) => { }}
                            setDataQ3={(data) => { }}
                            setDataQ4={(data) => { }}
                            handleCallback2={() => { }}
                            setDataWeightsPercent={(data) => () => { }}
                            status="Completed"
                            printing={true}
                            hideColumns={true}
                            isEmployee={report?.employeeId}
                            isManager={report?.managerId}
                            companyInfo={{ employeeNames: report?.fullname }}
                            stepStatus={[{ label: "Submit" }]}
                            hideHeaders
                            goals={report?.goals}
                        />
                    </div>
                </div>
            </div>
            <PageNumber pageNumber={pageNumber} />
        </div>
    );
}