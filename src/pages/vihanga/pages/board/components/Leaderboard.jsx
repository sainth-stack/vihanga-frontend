import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
  Stack,
} from "@mui/material";
import { Crown } from "lucide-react";
import Header from "./Header";
import CustomTabPanel from "./Tabpanel";
const data = [
  {
    name: "Suraj Khandwal",
    id: "#234786",
    points: 201.0,
    image: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    name: "Aman Sharma",
    id: "#234787",
    points: 195.5,
    image: "https://randomuser.me/api/portraits/men/2.jpg",
  },
  {
    name: "Priya Mehta",
    id: "#234788",
    points: 189.0,
    image: "https://randomuser.me/api/portraits/women/3.jpg",
  },
  {
    name: "Ravi Kumar",
    id: "#234789",
    points: 175.2,
    image: "https://randomuser.me/api/portraits/men/4.jpg",
  },
  {
    name: "Anita Desai",
    id: "#234790",
    points: 170.0,
    image: "https://randomuser.me/api/portraits/women/5.jpg",
  },
];

const medalColors = ["#F5A623", "#C0C0C0", "#CD7F32", "#B0B0B0", "#B0B0B0"];

export default function RewardLeaderboard() {
  return (
    <Card
      sx={{
        padding: "1rem",

        width: "100%",
        maxWidth: "100%",
        height: "100%",
        borderRadius: "20px",
        overflowY: "auto",
        margin: "0 auto", // centers the card horizontally
        boxShadow: "0px 0.1px 0px rgba(0,0,0,0.2)",
      }}
    >
      <Header text=" Reward Points Leaderboard" />

      <Box>
        <CustomTabPanel />
      </Box>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="body2" color="text.secondary">
          Top 5 Places
        </Typography>
        <Button
          size="small"
          sx={{
            color: "rgba(131, 127, 57, 1)",
            textDecoration: "underline",
            minWidth: "auto",
          }}
        >
          View All
        </Button>
      </Box>

      {data.map((person, index) => (
        <Card
          variant="outlined"
          key={index}
          sx={{
            width: "100%",
            maxWidth: "625px",
            height: 88,
            display: "flex",
            justifyContent: "center",
            borderRadius: "12px",
            padding: "15px",
          }}
        >
          <CardContent
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              px: 2,
              py: 1.5,
            }}
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              <Box position="relative" display="flex" alignItems="center">
                <Crown size={20} color={medalColors[index]} />
                <Typography
                  variant="caption"
                  color="#fff"
                  fontWeight="bold"
                  sx={{
                    position: "absolute",
                    top: "-4px",
                    left: "4px",
                    fontSize: "10px",
                  }}
                >
                  {index + 1}
                </Typography>
              </Box>
              <Avatar src={person.image} alt={person.name} />
              <Box>
                <Typography variant="body2" fontWeight={500}>
                  {person.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  ID: {person.id}
                </Typography>
              </Box>
            </Stack>

            <Stack direction="row" alignItems="center" spacing={1}>
              <Box
                component="img"
                src="https://cdn-icons-png.flaticon.com/512/1828/1828884.png"
                alt="coin"
                sx={{ width: 20, height: 20 }}
              />
              <Typography variant="body1" fontWeight={600}>
                {person.points}
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Card>
  );
}
