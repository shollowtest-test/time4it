"use client";

import { Box, CircularProgress, Typography } from "@mui/material";

export default function Loading() {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
    >
      <CircularProgress color="primary" />
      <Typography variant="body1" sx={{ mt: 2 }}>
        Ładowanie danych...
      </Typography>
    </Box>
  );
}
