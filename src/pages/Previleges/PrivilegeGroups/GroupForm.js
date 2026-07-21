/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Categories, ExcludeCategories, Role } from "utilities";
import SelectInputNoLabel from "components/Company/SelectInputNoLabel";
import {
  inActivefilterFinalItems,
  inActivefilterFinalItemsDelete,
} from "./filterItemsData";
import { previleges } from "reducer/privilegesGroup";
import { Box, Grid, IconButton, Button, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { InputTextComponent } from "pages/vihanga/components/input-elements/text";
import { SelectComponent } from "pages/vihanga/components/input-elements/select";
import { useTranslation } from "react-i18next";
import { canEdit } from "utilities/privilegeHelper";

export default function GroupForm({
  roleData,
  handleChangeSearch,
  handleChangeGroupMembers,
  wrapSelectOnChange,
  handleChangeExcludeGroupMembers,
  handleAdd,
  dispatch,
  handleSubmit,
  filterFinalItems,
  filterFinalItemsDelete,
}) {
  const [finalActiveMembers, setfinalActiveMembers] = useState([]);
       const { t } = useTranslation();
  
  useEffect(() => {
    if (roleData?.inActiveGroupMembers || roleData.activeGroupMembers) {
      let finalInActiveMembers =
        roleData?.inActiveGroupMembers &&
        roleData?.inActiveGroupMembers.length > 0
          ? [...roleData?.inActiveGroupMembers]
              .filter((item) => item.statuss)
              .map((item) => item._id)
          : [];
      let finalActiveMembers =
        finalInActiveMembers.length > 0
          ? roleData.activeGroupMembers &&
            [...roleData.activeGroupMembers].filter(
              (item) => !finalInActiveMembers.includes(item._id)
            )
          : roleData.activeGroupMembers;
      setfinalActiveMembers(finalActiveMembers);
    }
  }, [roleData]);
  return (
    <Box>
      <Box
        sx={{
          backgroundColor: "#fff",
          boxShadow: 2,
          borderRadius: "12px",
          p: 3,
          mb: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: "black",
              fontWeight: "bold",
            }}
          >
              {t("PrivilegeGroups.ActiveGroupMembership")}
          </Typography>
        </Box>
        <Grid container spacing={2} alignItems="center">
          
          <Grid item xs={12} md={12}>
            <InputTextComponent
              label={t("PrivilegeGroups.GroupName")}
              id="groupName"
              name="groupName"
              value={roleData?.groupName}
              onChange={handleChangeSearch}
              required = {true}
              fullWidth
              InputProps={{
                sx: {
                  borderRadius: "20px",
                  padding: "12px",
                },
              }}
            />
          </Grid>
        </Grid>
      </Box>

      <Box
        sx={{
          backgroundColor: "#fff",
          boxShadow: 2,
          borderRadius: "12px",
          p: 3,
          mb: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontFamily: "Work Sans",
              fontWeight: 400,
              fontStyle: "normal",
              fontSize: "12px",
              lineHeight: "19px",
              letterSpacing: "0%",
              color: "#707070",
            }}
          >
            {t("PrivilegeGroups.ChooseGroupMembers")}:
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: "black",
              fontWeight: "bold",
            }}
          >
            {t("PrivilegeGroups.PeoplePool")}
          </Typography>
        </Box>

        {roleData?.groupMembers.length > 0 &&
          roleData.groupMembers.map((groupMember, index) => (
            <Grid
              container
              key={index}
              alignItems="center"
              spacing={1}
              sx={{ mt: 2, mb: 2 }}
            >
              <Grid item md={5} xs={12} sm={12}>
                <SelectComponent
                  label={t("PrivilegeGroups.PickACategory")}
                  placeholder={t("PrivilegeGroups.Select")}
                  name="categoryName"
                  options={Categories}
                  value={groupMember.categoryName}
                 // onChange={handleChangeGroupMembers(index)}
                 onChange={wrapSelectOnChange(index, "categoryName", handleChangeGroupMembers)}

                />
              </Grid>

              <Grid
                item
                md={groupMember.categoryName === "Hire Date" ? 3 : 6}
                xs={12}
                sm={12}
              >
                <SelectInputNoLabel
                  label=""
                  placeholder={t("PrivilegeGroups.Select")}
                  name="categoryValue"
                  options={groupMember.categoryValues}
                  value={groupMember.categoryValue}
                  onChangeText={wrapSelectOnChange(index, "categoryValue", handleChangeGroupMembers)}
                />
              </Grid>

              {groupMember.categoryName === "Hire Date" && (
                <Grid item md={3} xs={12} sm={12}>
                  <InputTextComponent
                    type="date"
                    id="categoryValueText"
                    name="categoryValueText"
                    value={groupMember.categoryValueText}
                    onChange={wrapSelectOnChange(index, "categoryValueText", handleChangeGroupMembers)}
                    fullWidth
                    InputProps={{
                      sx: {
                        borderRadius: "20px",
                        padding: "12px",
                      },
                    }}
                  />
                </Grid>
              )}

              {canEdit() && (
                <Grid item xs={12} md="auto">
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <IconButton
                      onClick={() => {
                        dispatch(
                          previleges({
                            ...roleData,
                            groupMembers: [
                              ...roleData.groupMembers,
                              {
                                categoryName: "",
                                categoryValue: "",
                                categoryValueText: "",
                                categoryValues: [],
                              },
                            ],
                          })
                        );
                      }}
                      sx={{
                        width: 40,
                        height: 40,
                        backgroundColor: "#837F39",
                        color: "white",
                        borderRadius: "40px",
                        "&:hover": { backgroundColor: "#837F39" },
                      }}
                    >
                      <AddIcon />
                    </IconButton>

                    <IconButton
                      onClick={() => {
                        let groupMembers = roleData.groupMembers.filter(
                          (item, ind) => index !== ind
                        );
                        groupMembers =
                          groupMembers.length === 0
                            ? [
                                {
                                  categoryName: "",
                                  categoryValue: "",
                                  categoryValueText: "",
                                  categoryValues: [],
                                },
                              ]
                            : groupMembers;

                        let activeGroupMembers = filterFinalItemsDelete(
                          roleData.activeGroupMembers,
                          roleData.groupMembers,
                          roleData,
                          groupMember.categoryValue,
                          index,
                          dispatch
                        );

                        let finalRoleData = {
                          ...roleData,
                          groupMembers,
                          activeGroupMembers,
                        };

                        dispatch(previleges(finalRoleData));
                        filterFinalItems(
                          activeGroupMembers,
                          finalRoleData,
                          roleData.groupMembers,
                          dispatch
                        );
                      }}
                      sx={{
                        width: 40,
                        height: 40,
                        backgroundColor: "#837F39",
                        color: "white",
                        borderRadius: "40px",
                        "&:hover": { backgroundColor: "#837F39" },
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Grid>
              )}
            </Grid>
          ))}
      </Box>

       <Box
        sx={{
          backgroundColor: "#fff",
          boxShadow: 2,
          borderRadius: "12px",
          p: 3,
          mb: 3,
        }}
      >
        {" "}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontFamily: "Work Sans",
              fontWeight: 400,
              fontStyle: "normal",
              fontSize: "12px",
              lineHeight: "19px",
              letterSpacing: "0%",
              color: "#707070",
            }}
          >
            {t("PrivilegeGroups.ExcludeThesePeopleGroupName")}
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: "black",
              fontWeight: "bold",
            }}
          >
            {t("PrivilegeGroups.PeoplePool")}
          </Typography>
        </Box>
        {roleData?.excludeGroupMembers &&
          roleData?.excludeGroupMembers.length > 0 &&
          roleData?.excludeGroupMembers.map((groupMember, index) => (
          
            <Grid
              container
              alignItems="center"
              spacing={1}
              key={index}
              sx={{ mt: 2, mb: 2 }}
            >
              <Grid item xs={12} md={5}>
                <SelectComponent
                  label={t("PrivilegeGroups.PickACategory")}
                  placeholder={t("PrivilegeGroups.Select")}
                  name="categoryName"
                  options={ExcludeCategories}
                  value={groupMember.categoryName}
                  // onChange={handleChangeExcludeGroupMembers(index)}
                    onChange={wrapSelectOnChange(index, "categoryName", handleChangeExcludeGroupMembers)}
                />
              </Grid>

              <Grid
                item
                xs={12}
                md={groupMember.categoryName === "Hire Date" ? 3 : 6}
              >
                <SelectInputNoLabel
                  label=""
                  placeholder={t("PrivilegeGroups.Select")}
                  name="categoryValue"
                  options={groupMember.categoryValues}
                  value={groupMember.categoryValue}
                  onChangeText={wrapSelectOnChange(index, "categoryValue", handleChangeExcludeGroupMembers)}
                />
              </Grid>

              {groupMember.categoryName === "Hire Date" && (
                <Grid item xs={12} md={3}>
                  <InputTextComponent
                    type="date"
                    id="categoryValueText"
                    name="categoryValueText"
                    value={groupMember.categoryValueText}
                     onChange={wrapSelectOnChange(index, "categoryValueText", handleChangeExcludeGroupMembers)}
                    fullWidth
                    InputProps={{
                      sx: { borderRadius: "20px", padding: "6px 10px" },
                    }}
                  />
                </Grid>
              )}

              {canEdit() && (
                <Grid item xs={12} md="auto">
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <IconButton
                      onClick={() => {
                        dispatch(
                          previleges({
                            ...roleData,
                            excludeGroupMembers: [
                              ...roleData.excludeGroupMembers,
                              {
                                categoryName: "",
                                categoryValue: "",
                                categoryValueText: "",
                                categoryValues: [],
                              },
                            ],
                          })
                        );
                      }}
                      sx={{
                        width: 40,
                        height: 40,
                        backgroundColor: "#837F39",
                        color: "white",
                        borderRadius: "40px",
                        "&:hover": { backgroundColor: "#837F39" },
                      }}
                    >
                      <AddIcon />
                    </IconButton>

                    <IconButton
                      onClick={() => {
                        let excludeGroupMembers =
                          roleData.excludeGroupMembers.filter(
                            (item, ind) => index !== ind
                          );
                        excludeGroupMembers =
                          excludeGroupMembers.length === 0
                            ? [
                                {
                                  categoryName: "",
                                  categoryValue: "",
                                  categoryValueText: "",
                                  categoryValues: [],
                                },
                              ]
                            : excludeGroupMembers;

                        let inActiveGroupMembers = inActivefilterFinalItemsDelete(
                          roleData.inActiveGroupMembers,
                          roleData.excludeGroupMembers,
                          roleData,
                          groupMember.categoryValue,
                          index,
                          dispatch
                        );

                        let finalRoleData = {
                          ...roleData,
                          excludeGroupMembers,
                          inActiveGroupMembers,
                        };

                        dispatch(previleges(finalRoleData));
                        inActivefilterFinalItems(
                          inActiveGroupMembers,
                          finalRoleData,
                          roleData.excludeGroupMembers,
                          dispatch
                        );
                      }}
                      sx={{
                        width: 40,
                        height: 40,
                        backgroundColor: "#837F39",
                        color: "white",
                        borderRadius: "40px",
                        "&:hover": { backgroundColor: "#837F39" },
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Grid>
              )}
            </Grid>
          ))}
      </Box>
      
      {canEdit() && (
        <Box
          sx={{
            mt: 5,
            display: "flex",
            justifyContent: "flex-end",
            gap: 2,
          }}
        >
          <Button
            variant="outlined"
            onClick={handleAdd}
            sx={{
              width: "115px",
              height: "40px",
              gap: "8px",
              padding: "8px 16px",
              borderRadius: "20px",
              backgroundColor: "white",
              color: "black",
              border: "1px solid grey",
              textTransform: "none",
              fontWeight: 500,
              "&:hover": {
                backgroundColor: "white",
              },
            }}
          >
            {t("PrivilegeGroups.Cancel")}
          </Button>

          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{
              width: "115px",
              height: "40px",
              gap: "8px",
              padding: "8px 16px",
              borderRadius: "20px",
              backgroundColor: "#837F39",
              color: "white",
              textTransform: "none",
              fontWeight: 500,
              "&:hover": {
                backgroundColor: "#837F39", 
              },
            }}
          >
            {t("PrivilegeGroups.Finished")}
          </Button>
        </Box>
      )}
    </Box>
  );
}
