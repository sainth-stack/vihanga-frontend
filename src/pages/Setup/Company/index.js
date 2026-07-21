import React, { useState, useEffect } from "react";
import TitleHeader from "components/TitleHeader";
import "./styles.scss";
import Text from "components/Company/Text";
import HorizontalBar from "components/Company/HorizontalBar";
import SelectInput from "components/Company/SelectInput";
import editTableIcon from "assets/svg/editIcon.svg";
import trashIcon from "assets/svg/trashIcon.svg";
import { useDispatch } from "react-redux";
import {
  createCompany,
  deleteCompany,
  getCompanies,
  updateCompany,
} from "action/CompanyAct";
import { Col, Row } from "react-bootstrap";
import {
  AuthEmail,
  countriesNames,
  industries,
  LoadingIndicator,
  Validator,
} from "utilities";
import { Toast } from "service/toast";
import Entity from "./Entity";
import paginationFactory from "react-bootstrap-table2-paginator";
import TableNormal from "components/TableNormal";
import UpdateEntityData from "./UpdateData";
import AddCompanyData from "./AddData";
import { setCompanyId } from "reducer/userSlice";
import { loadAndApplyTheme } from "reducer/themeSlice";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  Box,
  Button,
  MenuItem,
  TextField,
  InputAdornment,
  Menu,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { canEdit, canDelete } from "utilities/privilegeHelper";
import { Typography,Chip, IconButton } from "@mui/material";
import { ArrowUpward, ArrowDownward } from "@mui/icons-material";
import {
  Search as SearchIcon,
  Add as AddIcon,
  SystemUpdateAltOutlined as ExportIcon,
} from "@mui/icons-material";
import { Dropdown } from "react-bootstrap";
import { BsThreeDotsVertical } from "react-icons/bs"; // 3-dot icon
import CustomTable from "pages/vihanga/components/CustomTable";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditSvgIcon from "assets/svg/EditSvg.svg";
import DeleteSvgIcon from "assets/svg/DeleteSvg.svg";

export const tableGenerator = (data, length) => {
  const items = [];
  for (let i = 0; i < length; i++) {
    items.push({
      id: i + 1,
      _id: data[i]._id,
      companyEntityName: data[i]?.companyEntityName,
      industry: data[i]?.industry,
      legalEntityName: data[i]?.legalEntityName,
      status: data[i]?.status,
      country: data[i]?.country,
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

  const { t } = useTranslation();
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
              primary={t("Reviews.Edit")}
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
              primary={t("Reviews.Delete")}
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
export default function Company() {
  const validator2 = Validator();
  const companyId = useSelector((store) => store.user.companyId);
  const [statusAnchorEl, setStatusAnchorEl] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState([]);
  const dispatch = useDispatch();
  let companyObj = {
    companyEntityName: "",
    industry: "All",
    country: "",
    status: "Active",
    userId: 1,
    _id: null,
  };
  const { t } = useTranslation();

  const [companyInfo, setCompanyInfo] = useState(companyObj);
  const [loading, setLoading] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [addShowModal, setShowAddModal] = useState(false);
  const [, setError] = useState(false);
  const [, forceUpdate] = useState(false);
  const [data, setData] = useState([]);
  const [totData, setTotData] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [company, setCompany] = useState("");
  const [isAvailable, setIsAvailable] = useState(false);
  const [companyInfoObj, setCompanyInfoObj] = useState({});
  const [filter, selectFilter] = useState(false);
  const [, setCompanyInfoObj2] = useState({});
  const [search, setSearch] = useState("");
  const statusOptions = ["Active", "Inactive"];
  const [visibleColumns, setVisibleColumns] = useState([
    "firstName",
    "lastName",
    "designation",
    "email",
    "department",
    "grade",
    "actions",
  ]);
  const [searchKey] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const handleChange = ({ target: { name, value } }) => {
    let updatedData = { ...companyInfo };
    updatedData[name] = value;
    setCompanyInfo(updatedData);
    setError("");
    if (name === "industry") {
      const finalData = data?.filter((item) => {
        if (value === "All") {
          return true;
        } else {
          return item.industry === value;
        }
      });
      selectFilter(true);
      setTotData(finalData);
    }
  };
  const handleChange2 = ({ target: { name, value } }) => {
    let filterCompany = [...data]?.filter((item) => item?._id === value)?.[0];
    setCompanyInfo(filterCompany);
    if (name === "companyEntityName") {
      localStorage.setItem("companyId", JSON.stringify(value));
      dispatch(setCompanyId(value));
      try {
        dispatch(loadAndApplyTheme(value));
      } catch {}
      window.location.reload();
      setCompany(value);
    }
    setError("");
  };
  const fetchCompanies = () => {
    try {
      setLoading(true);
      let response = dispatch(getCompanies());
      response.then(({ data, message }) => {
        if (data !== undefined && data.length > 0) {
          const sortedProducts = [...data].sort((a, b) => {
            if (a.industry === "Free-Trail" && b.industry !== "Free-Trail") {
              return 1;
            }
            if (a.industry !== "Free-Trail" && b.industry === "Free-Trail") {
              return -1;
            }
            return 0;
          });
          setData(sortedProducts);
          setTotData(sortedProducts);
          let companies = sortedProducts?.map((item) => ({
            key: item?.companyEntityName,
            value: item?._id,
          }));
          setCompanies(companies);
          if (localStorage.getItem("companyId") !== null) {
            let filteredCompany = companies?.filter(
              (item) => item?.value == companyId
            );
            let filteredData = sortedProducts?.filter(
              (item) => item?._id == companyId
            );
            setCompany(filteredCompany?.[0]?.value);
            setCompanyInfo(filteredData?.[0]);
            dispatch(setCompanyId(filteredCompany?.[0]?.value));
          } else {
            setCompany(companies?.[0]?.value);
            setCompanyInfo(sortedProducts?.[0]);
            dispatch(setCompanyId(companies?.[0]?.value));
          }
          setIsAvailable(true);
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

  const ActionFormatter = ({ row, onEdit, onDelete }) => {
    const [show, setShow] = useState(false);

    return (
      <div className="action-dropdown-wrapper">
        <BsThreeDotsVertical
          className="cursor-pointer"
          size={20}
          onClick={() => setShow(!show)}
        />
        {show && (
          <div className="action-dropdown-menu shadow">
            <div
              className="dropdown-item"
              onClick={() => {
                onEdit(row);
                setShow(false);
              }}
            >
              <img src={editTableIcon} alt="edit" />
              <span>Edit</span>
            </div>
            <div
              className="dropdown-item"
              onClick={() => {
                onDelete(row._id);
                setShow(false);
              }}
            >
              <img src={trashIcon} alt="delete" />
              <span>Delete</span>
            </div>
          </div>
        )}
      </div>
    );
  };

  const refreshData = () => {
    try {
      let response = dispatch(getCompanies());
      response.then(({ data, message }) => {
        if (data !== undefined && data.length > 0) {
          const sortedProducts = [...data].sort((a, b) => {
            if (a.industry === "Free-Trail" && b.industry !== "Free-Trail") {
              return 1;
            }
            if (a.industry !== "Free-Trail" && b.industry === "Free-Trail") {
              return -1;
            }
            return 0;
          });
          setData(sortedProducts);
          let companies = sortedProducts?.map((item) => ({
            key: item?.companyEntityName,
            value: item?._id,
          }));
          setCompanies(companies);
          if (companyId !== null) {
            let filteredCompany = companies?.filter(
              (item) => item?.value == companyId
            );
            let filteredData = sortedProducts?.filter(
              (item) => item?._id == companyId
            );
            setCompany(filteredCompany?.[0]?.value);
            setCompanyInfo(filteredData?.[0]);
            dispatch(setCompanyId(filteredCompany?.[0]?.value));
          } else {
            setCompany(companies?.[0]?.value);
            setCompanyInfo(sortedProducts?.[0]);
            dispatch(setCompanyId(companies?.[0]?.value));
          }
          setIsAvailable(true);
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

  const columns = [
    {
      id: "id",
      label: t("company.ID"),
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
            {row._id}
          </Typography>
        </Box>
      ),
    },
    {
      id: "companyEntityName",
      label: t("company.CompanyEntityName"),
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
            {row.companyEntityName}
          </Typography>
        </Box>
      ),
    },
    {
      id: "industry",
      label: t("company.Industry"),
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
            {row.industry}
          </Typography>
        </Box>
      ),
    },
    {
      id: "status",
      label: t("company.status"),
      render: (row) => (
        <Box display="flex" flexDirection="column" alignItems="center">
          <Typography color={"#837F39"}>{row?.status}</Typography>
        </Box>
      ),
    },
    {
      id: "country",
      label:t("company.country"),
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
      label: t("company.actions"),
      hidden: AuthEmail !== "superadmin@gmail.com",
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
  const handleDelete = (id) => {
    try {
      let response = dispatch(deleteCompany(id));
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
  const handleCallback = (childData) => {
    const updateEntityData = {
      _id: childData.id,
      companyEntityName: childData.companyEntityName,
      status: childData.status,
      country: childData.country,
      industry: childData.industry,
    };
    let result = dispatch(updateCompany(childData.id, updateEntityData));
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
  const handleCallback2 = (childData) => {
    const updateEntityData = {
      companyEntityName: childData.companyEntityName,
      status: childData.status,
      country: childData.country,
      industry: childData.industry,
    };
    let result = dispatch(createCompany(updateEntityData));
    result.then((response) => {
      if (response.success) {
        refreshData();
        setShowAddModal(false);
        setError("");
      } else {
        setError(response.message);
      }
    });
  };
  useEffect(() => {
    fetchCompanies();
    //eslint-disable-next-line
  }, []);
  const searchLower = search.trim().toLowerCase();

  const filteredData = data?.filter((item) => {
    // Search matching
    const searchMatch = (text) =>
      text?.toString().toLowerCase().includes(searchLower);
    
    const matchesSearch = [
      item?.companyEntityName,
      item?.industry,
      item?.legalEntityName,
      item?.status,
      item?.country
    ].some(searchMatch);

    // const matchesStatus = selectedStatus.length === 0 ||

    //                       selectedStatus.includes(item.status);

    return matchesSearch && company;
  });
  // Pagination
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice(
    page * rowsPerPage,
    (page + 1) * rowsPerPage
  );

  return (
    <>
<Box
  sx={{
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    minHeight: '100vh',
    padding: { xs: 2, lg: 4 },
    margin: { xs: 2, lg: 4 },
  }}
>           <div className="company-form  ">
          <div   style={{  paddingInline: "10px",display: "flex", justifyContent: "space-between" }}>
            <p
  className="font-weight-bold pb20"
  style={{ color: "#000000" }}
>
  {t("Company.Company_Setup")}
</p>
            {AuthEmail === "superadmin@gmail.com" && canEdit() && (
              <Button
                variant="outlined"
                startIcon={<AddIcon sx={{ width: 20, height: 20 }} />}
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
                onClick={() => setShowAddModal(true)}
              >
                {t("Company.add_new_company")}
              </Button>
            )}
          </div>

<Row className="g-3 my-2 px-2 py-2 sm:my-0 sm:px-0 sm:py-0">
           <Col xs={12} lg={4}>

              <SelectInput
                label={t("Company.Entity_group_name")}
                placeholder="--Select--"
                name="companyEntityName"
                inputId="company-entity-select"
                stackLabel={true}
                options={companies}
                value={company}
                onChangeText={handleChange2}
                aria-label={t("Company.Entity_group_name")}
                tabIndex={0}
                readonly={isAvailable && AuthEmail !== "superadmin@gmail.com"}
              />
              {validator2.current.message(
                "companyEntityName",
                companyInfo.companyEntityName,
                "required"
              )}
            </Col>

  <Col xs={12} lg={4}>
              <SelectInput
                label={t("Company.Industry")}
                stackLabel={true}
                placeholder="--Select--"
                name="industry"
                inputId="company-industry-select"
                options={industries}
                value={companyInfo.industry}
                onChangeText={handleChange}
                aria-label={t("Company.Industry")}
                tabIndex={0}
                readonly={isAvailable && AuthEmail !== "superadmin@gmail.com"}
              />
              {validator2.current.message(
                "industry",
                companyInfo.industry,
                "required"
              )}
            </Col>

  <Col xs={12} lg={4}>
              <SelectInput
                label={t("Company.Country")}
                placeholder="--Select--"
                name="country"
                inputId="company-country-select"
                stackLabel={true}
                options={countriesNames}
                value={companyInfo.country}
                onChangeText={handleChange}
                aria-label={t("Company.Country")}
                tabIndex={0}
                readonly={isAvailable && AuthEmail !== "superadmin@gmail.com"}
              />
              {validator2.current.message(
                "country",
                companyInfo.country,
                "required"
              )}
            </Col>
          </Row>
          <p className="title text-dark font-weight-bold pb10 mt-4">
            {t("Company.companyHistory")}
          </p>

          {loading ? (
            <div className="text-center">
              <LoadingIndicator size={3} />
            </div>
          ) : (
            <>
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
              />
            </>
            // <TableNormal
            //   data={filter ? totData : data}
            //   columns={columns}
            //   paginationFactory={paginationFactory}
            //   searchKey={searchKey}
            //   title="Company"
            //   keyField="_id"
            // />
          )}
          <div>
            <UpdateEntityData
              show={modalShow}
              onHide={() => setModalShow(false)}
              updata={companyInfoObj}
              handlecallback={handleCallback}
            />
          </div>
          <div>
            <AddCompanyData
              show={addShowModal}
              onHide={() => setShowAddModal(false)}
              handlecallback={handleCallback2}
            />
          </div>
          <HorizontalBar className="pt-3 pb-3" />
          <Entity companyInfo={companyInfo} />
        </div>
      </Box>
    </>
  );
}
