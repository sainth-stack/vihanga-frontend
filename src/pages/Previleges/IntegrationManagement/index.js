import React, { useState } from "react";
import "./index.scss";
import TitleHeader from "components/TitleHeader";
import CardWrapper from "./components/CardWrapper";
import salesforce from "assets/images/saleforce.png";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const jiraIcon = "https://wac-cdn.atlassian.com/dam/jcr:e2a6f056-9d7a-4d34-b7dc-63c652f7f1e1/jira-software.svg";

const intergrations = [
  {
    integrationType: "ERP & CRM",
    connectors: [
      {
        connectorName: "Salesforce",
        icon: salesforce,
        manageLink: "/admin/previlages/integrationManagement/salesforce/setup",
        readMoreLink: "/",
      },
    ],
  },
  {
    integrationType: "Project Management",
    connectors: [
      {
        connectorName: "Jira",
        icon: jiraIcon,
        manageLink: "/admin/previlages/integrationManagement/jira/setup",
        readMoreLink: "https://www.atlassian.com/software/jira",
      },
    ],
  },
];

const IntegrationManagement = () => {
  const { t } = useTranslation();

  return (
    <>
      <TitleHeader name={t("IntegrationManagement.AdminPortal")} />
      <div className="bg-light-primary rounded-12 mh-100 p-4 m-4">
        <CardWrapper>
          <div className="header">
            <div className="pt-0 pb-0">
              <h4 className="mb-0 title">
                {t("IntegrationManagement.BusinessLevelConnectors")}
              </h4>
              <p className="text-muted mb-0">
                {t("IntegrationManagement.ActivationDescription")}
              </p>
            </div>
          </div>
          <div className="card-body cards-container">
            {intergrations &&
              intergrations.map((integrate, index) => {
                return (
                  <div className="cards-list" key={index}>
                    <h5 className="mb-3 d-flex align-items-center justify-content-start connector-title">
                      {integrate.integrationType}
                    </h5>
                    <div className="connectors-list">
                      {integrate.connectors &&
                        integrate.connectors.map((connector, index) => {
                          return (
                            <CardWrapper
                              {...{
                                styles: {
                                  width: "fit-content",
                                },
                              }}
                              key={index}
                            >
                              <div className="single-card">
                                <div className="card-image">
                                  <img
                                    width={100}
                                    height={100}
                                    src={connector.icon}
                                    alt={connector.icon}
                                  />
                                </div>
                                <div className="card-content">
                                  <h4 className="title d-flex justify-content-start mb-0">
                                    {connector.connectorName}
                                  </h4>
                                  <div className="buttons-div">
                                    <Link to={connector.manageLink}>
                                      <button
                                        className="btn btn-outline-primary manage-btn"
                                        id={`myIntegration_${connector.connectorName}`}
                                      >
                                        {t("IntegrationManagement.Manage")}
                                      </button>
                                    </Link>
                                    <a
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="alink text-primary"
                                      href={connector.readMoreLink}
                                    >
                                      {t("IntegrationManagement.ReadMore")}
                                    </a>
                                  </div>
                                </div>
                              </div>
                            </CardWrapper>
                          );
                        })}
                    </div>
                  </div>
                );
              })}
          </div>
        </CardWrapper>
      </div>
    </>
  );
};

export default IntegrationManagement;
