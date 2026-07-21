import React from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const CreateTable = ({
  columns = [],
  data = [],
  page = 0,
  setPage = () => {},
  rowsPerPage = 10,
  setRowsPerPage = () => {},
  totalPages = 1,
  pagination = true,
}) => {
  return (
    <Box
      sx={{
        border: "1px solid #85803c",
        borderRadius: "1rem",
        overflow: "hidden",
      }}
    >
      <TableContainer>
        <Table>
          <TableHead
            sx={{
              background: "#F4F4F4",
              borderBottom: "none",
            }}
          >
            <TableRow>
              {columns
                .filter((col) => !col.hidden)
                .map((col) => (
                  <TableCell
                    key={col.id}
                    sx={{
                      fontSize: "16px",
                      fontWeight: 600,
                      fontFamily: "Montserrat",
                      borderBottom: "none",
                    }}
                  >
                    {col.label || ""}
                  </TableCell>
                ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.filter((c) => !c.hidden).length} sx={{ textAlign: "center", p: 4 }}>
                  No data available ....!
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, idx) => (
                <TableRow key={row._id || row.id || idx}>
                  {columns
                    .filter((col) => !col.hidden)
                    .map((column) => (
                      <TableCell key={column.id} sx={{ borderBottom: "1px solid #F4F4F4" }}>
                        {column.id === "actions"
                          ? column.render?.(row)
                          : column.render
                          ? column.render(row)
                          : row[column.id]}
                      </TableCell>
                    ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {pagination && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "0.5rem",
            marginTop: "1rem",
            marginBottom: "1rem",
            fontFamily: "Montserrat",
            fontSize: "14px",
          }}
        >
          <Button
            variant="text"
            onClick={() => setPage(page - 1)}
            disabled={page === 0}
            sx={{
              minWidth: "auto",
              color: page === 0 ? "#837F3980" : "#837F39",
              fontWeight: 400,
              textTransform: "none",
              display: "flex",
              alignItems: "center",
              gap: 0.5,
            }}
          >
            <ArrowBackIosNewIcon fontSize="small" />
            Back
          </Button>

          {[...Array(totalPages).keys()]
            .slice(Math.max(0, page - 1), Math.min(totalPages, page + 2))
            .map((number) => (
              <Button
                key={number}
                onClick={() => setPage(number)}
                sx={{
                  minWidth: "auto",
                  color: page === number ? "#fff" : "#837F39",
                  backgroundColor: page === number ? "#837F39" : "transparent",
                  fontWeight: 500,
                  fontFamily: "Montserrat",
                  borderRadius: "50%",
                  width: "32px",
                  height: "32px",
                  padding: 0,
                }}
              >
                {number + 1}
              </Button>
            ))}

          <Button
            variant="text"
            onClick={() => setPage(page + 1)}
            disabled={page >= totalPages - 1}
            sx={{
              minWidth: "auto",
              color: page >= totalPages - 1 ? "#837F3980" : "#837F39",
              fontWeight: 400,
              textTransform: "none",
              display: "flex",
              alignItems: "center",
              gap: 0.5,
            }}
          >
            Next
            <ArrowForwardIosIcon fontSize="small" />
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default CreateTable;


