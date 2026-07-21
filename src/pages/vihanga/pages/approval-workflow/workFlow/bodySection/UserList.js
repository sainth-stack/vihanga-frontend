import React, { useState, useEffect } from "react";
import InfoCardHeader from "../components/header";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { getEmployees } from "action/EmployeeAct"; // Adjust path as needed
import { Box, Typography, CircularProgress, Pagination } from "@mui/material";

const UserList = ({ onSelect, selectedApprovers, searchTerm }) => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchEmployees = async () => {
            setLoading(true);
            try {
                const response = await dispatch(getEmployees());
                if (response && response.data) {
                    setEmployees(response.data);
                }
            } catch (error) {
                console.error("Failed to fetch employees", error);
            } finally {
                setLoading(false);
            }
        };
        fetchEmployees();
    }, [dispatch]);

    const [page, setPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        setPage(1);
    }, [searchTerm]);

    const filteredEmployees = employees.filter((emp) => {
        const fullName = `${emp.personalInformation.firstName} ${emp.personalInformation.lastName}`.toLowerCase();
        const search = searchTerm.toLowerCase();
        return fullName.includes(search);
    });

    const count = Math.ceil(filteredEmployees.length / itemsPerPage);
    const paginatedData = filteredEmployees.slice(
        (page - 1) * itemsPerPage,
        page * itemsPerPage
    );

    const handleToggle = (user) => {
        const isSelected = selectedApprovers.some((approver) => approver.id === user._id);

        // Create card data structure consistent with role cards
        const cardData = {
            id: user._id,
            title: `${user.personalInformation.firstName} ${user.personalInformation.lastName}`,
            subtitle: user.employmentInformation.designation || user.employmentInformation.role || "",
            type: "user", // specific marker
            item: user // store full user object if needed later
        };

        onSelect(cardData, !isSelected);
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" p={3}>
                <CircularProgress />
            </Box>
        );
    }

    if (filteredEmployees.length === 0) {
        return (
            <Box p={3} textAlign="center">
                <Typography variant="body1" color="textSecondary">
                    {t("No users found")}
                </Typography>
            </Box>
        )
    }

    return (
        <Box display="flex" flexDirection="column" gap={2}>
            {paginatedData.map((user) => {
                const isSelected = selectedApprovers.some((approver) => approver.id === user._id);

                return (
                    <InfoCardHeader
                        key={user._id}
                        title={`${user.personalInformation.firstName} ${user.personalInformation.lastName}`}
                        subtitle={user.employmentInformation.designation || user.employmentInformation.role || ""}
                        buttonText={isSelected ? t("approval2.remove") : t("approval2.select")}
                        buttonIcon={isSelected ? <CloseIcon /> : <CheckIcon />}
                        buttonColor={isSelected ? "#FFFFFF" : "#827b37"}
                        buttonTextColor={isSelected ? "#827b37" : "#FFFFFF"}
                        buttonBorder={isSelected ? "1px solid #827b37" : "none"}
                        onButtonClick={() => handleToggle(user)}
                    />
                );
            })}

            {count > 1 && (
                <Box display="flex" justifyContent="center" mt={2}>
                    <Pagination
                        count={count}
                        page={page}
                        onChange={(e, v) => setPage(v)}
                        color="primary"
                        sx={{
                            "& .MuiPaginationItem-root": {
                                color: "#837F39",
                            },
                            "& .Mui-selected": {
                                backgroundColor: "#837F39 !important",
                                color: "#fff !important",
                            },
                        }}
                    />
                </Box>
            )}
        </Box>
    );
};

export default UserList;
