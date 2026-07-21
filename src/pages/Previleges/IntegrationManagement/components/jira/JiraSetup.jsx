import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import CardWrapper from "../CardWrapper";
import { api } from "service/api";
import { getServiceUrl } from "service/api";
import axios from "axios";
import { Toast } from "service/toast";
import { companyApi } from "service/apiVariables";
import "../auth/index.scss";
import "./index.scss";

const jiraIcon =
  "https://wac-cdn.atlassian.com/dam/jcr:e2a6f056-9d7a-4d34-b7dc-63c652f7f1e1/jira-software.svg";

const JiraSetup = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [formData, setFormData] = useState({
    domain: "",
    apiToken: "",
  });

  const companyId = JSON.parse(localStorage.getItem("companyId") || '""');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const rawUser = localStorage.getItem("user");
        const parsedUser = rawUser ? JSON.parse(rawUser) : {};
        const token = parsedUser?.token || "";

        if (companyId) {
          if (parsedUser?.company) {
            setCompanyName(parsedUser.company);
          } else {
            try {
              const companyRes = await api({
                ...companyApi.getCompanyById(companyId),
              });
              const data = companyRes?.data || companyRes;
              setCompanyName(data?.companyEntityName || data?.companyName || "");
            } catch {
              // ignore
            }
          }
        }

        const res = await axios.get(
          `${getServiceUrl("production")}integrations/jira/config`,
          {
            params: { companyId },
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const data = res.data?.data;
        if (data) {
          setFormData((prev) => ({
            ...prev,
            domain: data.domain ? `${data.domain}.atlassian.net` : "",
            apiToken: "", // Don't pre-fill token for security
          }));
        }
      } catch (err) {
        // Config may not exist yet
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [companyId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.domain || !formData.apiToken) {
      Toast({
        message: "Please fill Domain and API Token",
        type: "warning",
        time: 3000,
      });
      return;
    }
    setSaving(true);
    try {
      const domain = formData.domain
        .replace(/^https?:\/\//, "")
        .replace(/\.atlassian\.net.*$/, "")
        .trim();
      const res = await api({
        method: "post",
        api: "integrations/jira/config",
        body: {
          domain,
          apiToken: formData.apiToken,
          companyId,
        },
      });
      if (res?.success) {
        Toast({
          message: "Jira configuration saved successfully",
          type: "success",
          time: 3000,
        });
      }
    } catch (err) {
      Toast({
        message: err?.message || "Failed to save Jira configuration",
        type: "error",
        time: 3000,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-light-primary rounded-12 mh-100 p-4 m-4">
      <CardWrapper>
        <div className="header">
          <div className="pt-0 pb-0 d-flex align-items-center">
            <h4 className="mb-0 title">Jira Integration</h4>
          </div>
        </div>
        <div className="card-body">
          <p className="text-muted mb-4">
            Connect your Jira instance to link Key Results with Jira issues.
            Employee emails for Jira issues are taken from the Key Result screen (objective owner).
          </p>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Jira Domain *</label>
                <input
                  type="text"
                  className="form-control"
                  name="domain"
                  placeholder="yoursite.atlassian.net"
                  value={formData.domain}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-4">
                <label className="form-label">API Token *</label>
                <input
                  type="password"
                  className="form-control"
                  name="apiToken"
                  placeholder="Your Jira API token"
                  value={formData.apiToken}
                  onChange={handleChange}
                />
                <small className="text-muted">
                  Create an API token at{" "}
                  <a
                    href="https://id.atlassian.com/manage-profile/security/api-tokens"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    id.atlassian.com
                  </a>
                </small>
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Configuration"}
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary ms-2"
                onClick={() => history.push("/admin/previlages/integrationManagement")}
              >
                Back
              </button>
            </form>
          )}
        </div>
      </CardWrapper>
    </div>
  );
};

export default JiraSetup;
