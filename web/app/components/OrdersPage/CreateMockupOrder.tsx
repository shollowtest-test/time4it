"use client";

import React, { useActionState, useEffect, useRef, useState } from "react";

import {
  Card,
  CardContent,
  CardHeader,
  Stack,
  Button,
  Alert,
  Typography,
} from "@mui/material";
import { createOrder } from "@/app/actions/createOrder";

interface FormState {
  success: boolean;
  message: string;
}

const initialState: FormState = { success: false, message: "" };

export function CreateOrderForm() {
  const [state, formAction] = useActionState(createOrder, initialState);
  const [fileName, setFileName] = useState<string>("");
  const formRef = useRef<HTMLFormElement>(null);

  // Reset form when submission succeeds
  useEffect(() => {
    if (state.success) formRef.current?.reset();
  }, [state.success]);

  return (
    <Card sx={{ maxWidth: 500, margin: "auto", mt: 4 }}>
      <CardHeader title="Utwórz nowe zamówienie" />
      <CardContent>
        <form ref={formRef} action={formAction}>
          <Stack spacing={2}>
            <div>
              <Typography
                component="label"
                variant="body1"
                sx={{ display: "block", mb: 1 }}
              >
                Załącznik *
              </Typography>

              {/* Ukryty input */}
              <input
                type="file"
                name="file"
                required
                id="file-upload"
                style={{ display: "none" }}
                onChange={(e) => {
                  // opcjonalnie możesz tutaj przechować wybrany plik lub nazwę
                  const fileName = e.target.files?.[0]?.name;
                  // np. ustaw stan z nazwą pliku, jeśli chcesz pokazać nazwę obok
                }}
              />

              {/* Stylizowany przycisk otwierający eksplorator plików */}
              <label htmlFor="file-upload">
                <Button variant="outlined" component="span">
                  Wybierz plik
                </Button>
              </label>
            </div>

            <Button type="submit" variant="contained">
              "Generuj zamówienie"
            </Button>

            {state.message && (
              <Alert severity={state.success ? "success" : "error"}>
                {state.message}
              </Alert>
            )}
          </Stack>
        </form>
      </CardContent>
    </Card>
  );
}
