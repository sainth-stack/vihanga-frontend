import React, { useState, useEffect } from "react";
import {useHistory} from "react-router-dom"
import "./styles.scss";
import Text from "components/Company/Text";
import HorizontalBar from "components/Company/HorizontalBar";
import TextInput from "components/Company/TextInput";
import SelectInput from "components/Company/SelectInput";
import paginationFactory from "react-bootstrap-table2-paginator";
import trashIcon from "assets/svg/trashIcon.svg";
import editTableIcon from "assets/svg/editTableIcon.svg";
import add from "assets/svg/add.svg";
import closeIcon from "assets/svg/closefile.svg";
import CheckboxInput from "components/Company/CheckboxInput";
import DownloadLink from "components/Company/DownloadLink";
import BrowseFiles from "components/Company/BrowseFiles";
import UploadProgress from "components/Company/UploadProgress";
import { useDispatch, useSelector } from "react-redux";
import {
  bytesToSize,
  countriesNames,
  LoadingIndicator,
  statusesActive,
} from "utilities";
import { Col, Row } from "react-bootstrap";
import { entityApi } from "service/apiVariables";
import axios from "axios";
import { getServiceUrl } from "service/api";
import { Validator } from "utilities";
import {
  createUpload,
  deleteUpload,
  getUploadsByCategory,
} from "action/UploadAct";
import { Toast } from "service/toast";
import {
  createEntity,
  deleteEntity,
  getEntities,
  updateEntity,
} from "action/EntityAct";
import UpdateEntityData from "./UpdateData";
import TableNormal from "components/TableNormal";
import FileUpload from "../../../vihanga/components/filesUplode/draganddropFile";
import {
  Typography,
  Box,
  Button,
  MenuItem,
  IconButton,
  Menu,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import CustomTable from "pages/vihanga/components/CustomTable";
import { BsThreeDotsVertical } from "react-icons/bs"; // 3-dot icon
import { FaSave } from "react-icons/fa";
import { Download } from "lucide-react";
import addButtonIcon from "assets/svg/addButtonIcon.svg";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditSvgIcon from "assets/svg/EditSvg.svg";
import DeleteSvgIcon from "assets/svg/DeleteSvg.svg";
import useWindowSize from "components/UseWindowSize";
import { useTranslation } from "react-i18next";
import { canEdit, canDelete } from "utilities/privilegeHelper";

const CancelToken = axios.CancelToken;
const link =
  "https://res.cloudinary.com/dbqm9svvp/raw/upload/v1688019379/talentspotifypics/Entity-Template_utv8ry.csv";
const source = CancelToken.source();
export const tableGenerator = (data, length) => {
  const items = [];
  for (let i = 0; i < length; i++) {
    items.push({
      id: i + 1,
      _id: data[i]._id,
      companyEntityName: data[i].companyEntityName,
      industry: data[i].industry,
      legalEntityName: data[i].legalEntityName,
      status: data[i].status,
      country: data[i].country,
    });
  }
  return items;
};

const ActionMenu = ({ row, handleEdit, handleDelete }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const hasEditPermission = canEdit();
  const hasDeletePermission = canDelete();
  
  // Don't render if no permissions
  if (!hasEditPermission && !hasDeletePermission) {
    return null;
  }

  return (
    <div style={{ position: "relative" }}>
      <IconButton onClick={handleMenuClick} size="small">
        <MoreVertIcon />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        sx={{
          "& .MuiPaper-root": {
            borderRadius: "1rem",
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
            border: "1px solid #eee",
            minWidth: "200px",
          },
        }}
      >
        {hasEditPermission && (
          <MenuItem
            onClick={(e) => {
              e.stopPropagation();
              handleClose();
              handleEdit(row);
            }}
          >
            <ListItemIcon sx={{ minWidth: "30px" }}>
              <img src={EditSvgIcon} alt="Edit" width="18" height="18" />
            </ListItemIcon>
            <ListItemText
              primary="Edit"
              sx={{
                color: "#6D6D6D",
                fontWeight: "500",
                fontSize: "14px",
                letterSpacing: "1%",
              }}
            />
          </MenuItem>
        )}

        {hasDeletePermission && (
          <MenuItem
            onClick={(e) => {
              e.stopPropagation();
              handleClose();
              handleDelete(row._id);
            }}
          >
            <ListItemIcon sx={{ minWidth: "30px" }}>
              <img src={DeleteSvgIcon} alt="Delete" width="18" height="18" />
            </ListItemIcon>
            <ListItemText
              primary="Delete"
              sx={{
                color: "#6D6D6D",
                fontWeight: "500",
                fontSize: "14px",
                letterSpacing: "1%",
              }}
            />
          </MenuItem>
        )}
      </Menu>
    </div>
  );
};

export default function Entity({ companyInfo }) {
  const companyId = useSelector((store) => store.user.companyId);
  const validator = Validator();  
  const dispatch = useDispatch();
  let legalEntityObj = {
    legalEntityName: "",
    status: "",
    country: "",
    _id: null,
  };
  const [modalShow, setModalShow] = React.useState(false);
  // const [companyInfos, setCompanyInfos] = useState([]);
  const [companyInfoObj, setCompanyInfoObj] = useState({});
  const [uploads, setUploads] = useState([]);
  const [searchKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [, forceUpdate] = useState(false);
  const [data, setData] = useState([]);
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(0);
  const [total, setTotal] = useState(0);
  const [showProgress, setShowProgress] = useState(false);
  const [isBulkUpload, setBulkUpload] = useState(true);
  const [fileName, setFileName] = useState("");
  const [search, setSearch] = useState("");
  const [statusAnchorEl, setStatusAnchorEl] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState([]);
  const [companyInfos, setCompanyInfos] = useState([]);
   const [visibleColumns, setVisibleColumns] = useState([
      "legalEntityName",
      "status",
      "country",
      "actions",
    
    ]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const statusOptions = ["Active", "Inactive"];
  const history = useHistory()
const isMobile = useWindowSize();
  const { t } = useTranslation();
  const columns = [
    {
      id: "legalEntityName",
      label: t("Company.legal_entity_name"),
      render: (row) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography
            sx={{
              fontSize: "14px",
              color: "#535353",
              fontFamily: "Work Sans",
              fontWeight: "400",
            }}
          >
            {row.legalEntityName}
          </Typography>
        </Box>
      ),
    },
    {
      id: "status",
      label: t("Company.Status"),
      render: (row) => (
        <Box display="flex" flexDirection="column" alignItems="center">
          <Typography color={"#837F39"}>{row?.status}</Typography>
        </Box>
      ),
    },
    {
      id: "country",
      label: t("Company.Country"),
      render: (row) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography
            sx={{
              fontSize: "14px",
              color: "#535353",
              fontFamily: "Work Sans",
              fontWeight: "400",
            }}
          >
            {row.country}
          </Typography>
        </Box>
      ),
    },
    {
      id: "actions",
      label: t("Company.Action"),
      render: (row) => {
        const hasActions = canEdit() || canDelete();
        if (!hasActions) return null;
        
        return (
          <ActionMenu
            row={row}
            handleEdit={(data) => {
              setModalShow(true);
              handleObj({ ...data, companyId: companyInfo._id });
            }}
            handleDelete={handleDelete}
            sx={{ display: "flex", alignItems: "center" }}
          />
        );
      },
    },
  ];
  const handleObj = (row) => {
    setCompanyInfoObj(row);
  };
  const handleStatusToggle = (status) => {
    setSelectedStatus((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const handleAddItem = () => {
    let updatedData = [...companyInfos];
    updatedData.push(legalEntityObj);
    setCompanyInfos(updatedData);
    setError("");
  };
  const handleRemoveItem = (index) => {
    let updatedData = [...companyInfos];
    updatedData.splice(index, 1);
    setCompanyInfos(updatedData);
    setError("");
  };
  const fetchEntities = () => {
    try {
      setLoading(true);
      let response = dispatch(getEntities());
      response.then(({ data, message }) => {
        if (data !== undefined && data.length > 0) {
          let result = tableGenerator(data, data.length);
          setData(result);
          setLoading(false);
          setError("");
        } else if (data.length === 0) {
          setLoading(false);
          setData([]);
          setError("No Data Found!");
        } else {
          setLoading(false);
          setError(message);
        }
      });
    } catch (error) {
      setLoading(false);
      setError(error.toString());
    }
  };

  const fetchUploads = () => {
    try {
      setLoading(true);
      let response = dispatch(getUploadsByCategory("company"));
      response.then(({ data, message }) => {
        if (data !== undefined && data.length > 0) {
          setUploads(data);
          setLoading(false);
          setError("");
        } else if (data.length === 0) {
          setLoading(false);
          setUploads([]);
        } else {
          setLoading(false);
          setError(message);
        }
        setTotal(0);
        setProgress(0);
        setLoaded(0);
      });
    } catch (error) {
      setLoading(false);
      setError(error.toString());
    }
  };

  const refreshData = () => {
    try {
      let response = dispatch(getEntities());
      response.then(({ data, message }) => {
        if (data !== undefined && data.length > 0) {
          let result = tableGenerator(data, data.length);
          setData(result);
          setError("");
        } else if (data.length === 0) {
          setData([]);
          setError("No Data Found!");
        } else {
          setError(message);
        }
      });
    } catch (error) {
      setError(error.toString());
    }
  };

  const searchLower = search.toLowerCase();

  const filteredData = data.filter((item) => {
    // Search matching
    const searchMatch = (text) =>
      text?.toString().toLowerCase().includes(searchLower);

    const matchesSearch = [
      item.legalEntityName,
      item.country,
      item.status,
    ].some(searchMatch);

    const matchesStatus = selectedStatus.length === 0 ||
                          selectedStatus.includes(item.status);

    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice(
    page * rowsPerPage,
    (page + 1) * rowsPerPage
  );
    const columnsToRender = columns.filter((col) =>
    visibleColumns.includes(col.id)
  );
  const handleChangeCompanyInfo = ({ target: { name, value } }, index) => {
    const updatedCompanyInfos = [...companyInfos];
    updatedCompanyInfos[index][name] = value;
    setCompanyInfos(updatedCompanyInfos);
  };

  const handleDelete = (id) => {
    try {
      let response = dispatch(deleteEntity(id));
      response.then(({ success, message }) => {
        if (success) {
          refreshData();
          setError("");
        } else {
          setError(message);
        }
      });
    } catch (error) {
      setLoading(false);
      setError(error.toString());
    }
  };
  const deleteUploadData = (id) => {
    try {
      let response = dispatch(deleteUpload(id));
      response.then(({ success, message }) => {
        if (success) {
          fetchUploads();
          setError("");
        } else {
          setError(message);
        }
      });
    } catch (error) {
      setLoading(false);
      setError(error.toString());
    }
  };
  const handleSave = () => {
    if (
      validator.current.allValid() &&
      companyInfos[0].legalEntityName.length > 0 &&
      companyInfos[0].status.length > 0 &&
      companyInfos[0].country.length > 0
    ) {
      try {
        let result = companyInfos.map((entity) => {
          return {
            companyEntityName: companyInfo.companyEntityName,
            companyId: companyInfo._id,
            industry: companyInfo.industry,
            ...entity,
          };
        });
        let response = dispatch(createEntity(result[0]));
        response.then(({ success, message }) => {
          setLoading(true);
          if (success) {
            setLoading(false);
            refreshData();
            setError("");
            setCompanyInfos([]);
          } else {
            setLoading(false);
            setError(message);
          }
        });
      } catch (error) {
        setLoading(false);
        setError(error.toString());
      }
    } else {
      validator.current.showMessages();
      forceUpdate(true);
      Toast({
        type: "warning",
        message: "Please fill all the fields",
        time: "4000",
      });
    }
  };
  const handleFileUpload = async ({ data: companies, file, url }) => {
    setShowProgress(true);
    setFileName(file.name);
    let reqBody = {
      category: "company",
      filename: file.name,
      loadedData: loaded,
      totalData: total,
      fileSize: bytesToSize(file.size),
      fileUrl: url,
      companyId,
    };
    let legalEntityNames = data.map((depart) => depart.legalEntityName);
    let countries = data.map((depart) => depart.countries);
    let filteredCompanies = companies.filter(
      (company) =>
        !legalEntityNames.includes(company.legalEntityName) &&
        !countries.includes(company.country)
    );
    let totalCompanies = [...companies];
    companies = filteredCompanies.map((company) => {
      return {
        ...company,
        companyEntityName: companyInfo.companyEntityName,
        industry: companyInfo.industry,
        companyId,
        _id: null
      };
    });
    let result = await axios
      .post(
        getServiceUrl("production") +
          entityApi.createOrUpdateMultipleEntities.api,
        { data: companies },
        {
          onUploadProgress: (data) => {
            setTotal(totalCompanies.length);
            setLoaded(
              Math.round(
                100 * (data.loaded / data.total) * (totalCompanies.length / 100)
              )
            );
            setProgress(Math.round((100 * data.loaded) / data.total));
          },
        }
      )
      .catch((err) => {
        reqBody.status = "failed";
        reqBody.loadedData = filteredCompanies.length;
        reqBody.totalData = totalCompanies.length;
        const uploadResponse = dispatch(createUpload(reqBody));
        uploadResponse
          .then(({ success, message, id }) => {
            if (success) {
              setError("");
              setTimeout(() => {
                setShowProgress(false);
                fetchUploads();
                refreshData();
              }, 2000);
            } else {
              setTimeout(() => {
                setShowProgress(false);
                fetchUploads();
                refreshData();
              }, 2000);
              setError(message);
            }
          })
          .catch((error) => {
            console.log("error detected", error);
          });
      });
    if (result?.data?.success) {
      reqBody.status = "success";
      reqBody.loadedData = filteredCompanies.length;
      reqBody.totalData = totalCompanies.length;
      const uploadResponse = dispatch(createUpload(reqBody));
      uploadResponse
        .then(({ success, message, id }) => {
          if (success) {
            setError("");
            setTimeout(() => {
              setShowProgress(false);
              fetchUploads();
              refreshData();
            }, 2000);
          } else {
            setTimeout(() => {
              setShowProgress(false);
              fetchUploads();
              refreshData();
            }, 2000);
          }
        })
        .catch((error) => {
          console.log("error detected", error);
        });
    } else {
      setTimeout(() => {
        setShowProgress(false);
        fetchUploads();
        refreshData();
      }, 2000);
    }
  };
  const cancelUpload = () => {
    source.cancel();
  };
  const handleCallback = (childData) => {
    const updateEntityData = {
      _id: childData.id,
      legalEntityName: childData.legalEntityName,
      status: childData.status,
      country: childData.country,
      companyEntityName: childData.companyEntityName,
      companyId: childData.companyId,
      industry: childData.industry,
    };
    let result = dispatch(updateEntity(childData.id, updateEntityData));
    result.then((response) => {
      if (response.success) {
        refreshData();
        setModalShow(false);
        setError("");
      } else {
        setError(response.message);
      }
    });
  };
  useEffect(() => {
    fetchEntities();
    fetchUploads();
    //eslint-disable-next-line
  }, []);

  return (
    <Box
      sx={{
        padding: { xs: 2, lg: 0 }, 
      }}
    >
    <div>
      <div style={{ paddingInline: "10px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <Text style={{ fontSize: "14px", fontWeight: "bold", color: "#2B2B2B", margin: 0 }} text={t("Company.legal_entity_name")} />
        {companyInfos.length === 0 && canEdit() && (
          <Button
            variant="contained"
            onClick={handleAddItem}
            sx={{
              height: "34px",
              borderRadius: "100px",
              backgroundColor: "#837F39",
              color: "#FFFFFF",
              fontWeight: 500,
              fontSize: "12px",
              textTransform: "none",
              "&:hover": { backgroundColor: "#6e6b32", color: "#FFFFFF" },
            }}
          >
            Add Legal Entity
          </Button>
        )}
      </div>
      {companyInfos.map((entity, index) => (
        <div key={index} style={{ marginBottom: "30px", padding: "20px", border: "1px solid #e0e0e0", borderRadius: "8px", backgroundColor: "#fafafa" }}>
          <Text
            style={{ fontSize: "16px", fontWeight: "bold", color: "#837F39", marginBottom: "20px" }}
            text={entity._id !== null ? "Edit Legal Entity" : "Add Legal Entity"}
          />
          <Row className="g-3 my-2 px-2 py-2 sm:my-0 sm:px-0 sm:py-0">
            <Col xs={12} lg={4}>
              <TextInput
                stackLabel={true}
                label={t("Company.legal_entity_name")}
                name="legalEntityName"
                value={entity.legalEntityName}
                onChangeText={(e) => handleChangeCompanyInfo(e, index)}
                inputStyle="custom-no-margin"
                readonly={!canEdit()}
              />
              {validator.current.message("legalEntityName", entity.legalEntityName, "required")}
            </Col>
            <Col xs={12} lg={4}>
              <SelectInput
                name="status"
                label={t("Company.Status")}
                value={entity.status}
                onChangeText={(e) => handleChangeCompanyInfo(e, index)}
                options={statusesActive}
                stackLabel={true}
                readonly={!canEdit()}
              />
              {validator.current.message("status", entity.status, "required")}
            </Col>
            <Col xs={12} lg={4}>
              <SelectInput
                name="country"
                label={t("Company.Country")}
                value={entity.country}
                onChangeText={(e) => handleChangeCompanyInfo(e, index)}
                options={countriesNames}
                stackLabel={true}
                readonly={!canEdit()}
              />
              {validator.current.message("country", entity.country, "required")}
            </Col>
          </Row>
          {canEdit() && (
            <Row className="g-3 my-2 px-2 py-2 sm:my-0 sm:px-0 sm:py-0">
              <Col xs={12} className="d-flex justify-content-end align-items-center">
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button
                    variant="outlined"
                    onClick={() => handleRemoveItem(index)}
                    sx={{
                      height: "34px",
                      borderRadius: "100px",
                      borderColor: "#837F39",
                      color: "#837F39",
                      fontWeight: 500,
                      fontSize: "12px",
                      textTransform: "none",
                      "&:hover": { borderColor: "#6e6b32", color: "#6e6b32" },
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleSave}
                    sx={{
                      height: "34px",
                      borderRadius: "100px",
                      backgroundColor: "#837F39",
                      color: "#FFFFFF",
                      fontWeight: 500,
                      fontSize: "12px",
                      textTransform: "none",
                      "&:hover": { backgroundColor: "#6e6b32", color: "#FFFFFF" },
                    }}
                  >
                    Save
                  </Button>
                </Box>
              </Col>
            </Row>
          )}
        </div>
      ))}
      {loading ? (
        <div className="text-center">
          <LoadingIndicator size={3} />
        </div>
      ) : (
        <div style={{marginTop:'20px'}}>
          <CustomTable
            data={paginatedData}
            columns={columns}
            pagination={true}
            page={page}
            totalPages={totalPages}
            rowsPerPage={rowsPerPage}
            totalCount={data.length}
            setPage={setPage}
            onRowsPerPageChange={(newRowsPerPage) => {
              setRowsPerPage(newRowsPerPage);
              setPage(0);
            }}
            search={search}
            setSearch={setSearch}
            rowsPerPageOptions={[5, 8, 10, 20]}
            isCompany={true}
            statusAnchorEl={statusAnchorEl}
            setStatusAnchorEl={setStatusAnchorEl}
            statusOptions={statusOptions}
            handleStatusToggle={handleStatusToggle}
            selectedStatus={selectedStatus}
            visibleColumns={visibleColumns}
            setVisibleColumns={setVisibleColumns}
            columnsToRender={columnsToRender}
          />
        </div>
      )}
      <Box sx={{ mx: { xs: 2, sm: 0 } }}>
      <p className="m-0 fs14 text-center text-danger">
        {error.length > 0 ? error : ""}
      </p>
      <HorizontalBar className="pt-3 pb-3" />
      {/* <Text text={t("Company.bulk_upload_of_legal_entities")} /> */}
      <Typography>{t("Company.bulk_upload_of_legal_entities")} </Typography>
      <div className="col-md-12 m-0 p-0 d-flex justify-content-between align-items-center">
        {canEdit() && (
          <CheckboxInput
            label={t("Company.bulk_upload_of_legal_entities_checkbox")}
            name="isBulkUpload"
            value={isBulkUpload}
            onChangeText={(e) => setBulkUpload(!isBulkUpload)}
          />
        )}
        <Button
          variant="outlined"
          startIcon={<Download sx={{ width: 20, height: 20 }} />}
          sx={{
            // width: "160px",

            height: "34px",
            borderRadius: "100px",
            border: "1px solid #837F39",

            gap: "8px",
            backgroundColor: "#837F39",
            color: "#FFFFFF",
            fontWeight: 500,
            fontSize: "11px",
            textTransform: "none",
            "&:hover": {
              backgroundColor: "#837F39",
              color: "#FFFFFF",
            },
          }}
          >
             <a href={link} target="_blank" style={{color:'white'}} rel="noopener noreferrer" className="download-link p-0 m-0">{t("Company.download_template")}</a>

        </Button>

      </div>
      </Box>
      {isBulkUpload && canEdit() && (
        <>
          <Box mt={2}>
            <Typography fontWeight={500} fontSize={16}>
              {t("Rewards.uploadFiles")}
            </Typography>
            <FileUpload
              id="company-file-upload"
              // value={formData.file}
              onFileUpload={handleFileUpload}
            />
          </Box>
        </>     
      )}
      <div>
        <UpdateEntityData
          show={modalShow}
          onHide={() => setModalShow(false)}
          updata={companyInfoObj}
          handlecallback={handleCallback}
        />
      </div>
    </div>
    </Box>
  );
}
