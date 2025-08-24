"use client";

import React, {
  startTransition,
  useEffect,
  useState,
  useCallback,
} from "react";
import {
  Paper,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  CircularProgress,
  Chip,
} from "@mui/material";
import { createSocket, disconnectSocket } from "@/lib/webSocket";
import { fetchOrders } from "@/app/actions/fetchOrders";
import { getStatusColor } from "@/app/utils/getChipColor";

interface Order {
  orderId: string;
  tenantId: string;
  buyerEmail: string;
  status: string;
  total: number;
  createdAt: string;
  attachment?: any;
}

interface Props {
  initialItems: Order[];
  initialPage: number;
  initialLimit: number;
  initialTotal: number;
  tenantId: string;
  refreshTrigger?: number;
}

export default function OrdersList({
  initialItems,
  initialPage,
  initialLimit,
  initialTotal,
  tenantId,
  refreshTrigger,
}: Props) {
  const [orders, setOrders] = useState<Order[]>(initialItems);
  const [page, setPage] = useState<number>(initialPage - 1); // zero-based
  const [rowsPerPage, setRowsPerPage] = useState<number>(initialLimit);
  const [total, setTotal] = useState<number>(initialTotal);
  const [loading, setLoading] = useState<boolean>(false);

  const loadPage = useCallback(
    (newPage: number, newLimit: number) => {
      setLoading(true);
      startTransition(async () => {
        try {
          const data = await fetchOrders(newPage + 1, newLimit);
          setOrders(data.items);
          setTotal(data.total ?? total);
        } catch (err) {
          console.error("Error fetching orders:", err);
        } finally {
          setLoading(false);
        }
      });
    },
    [total]
  );

  const refreshOrders = useCallback(() => {
    setPage(0);
    loadPage(0, rowsPerPage);
  }, [loadPage, rowsPerPage]);

  useEffect(() => {
    if (refreshTrigger !== undefined) {
      refreshOrders();
    }
  }, [refreshTrigger, refreshOrders]);

  useEffect(() => {
    setOrders(initialItems);
    setPage(initialPage - 1);
    setRowsPerPage(initialLimit);
    setTotal(initialTotal);
  }, [initialItems, initialPage, initialLimit, initialTotal]);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
    loadPage(newPage, rowsPerPage);
  };

  const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const size = parseInt(e.target.value, 10);
    setRowsPerPage(size);
    setPage(0);
    loadPage(0, size);
  };

  useEffect(() => {
    if (!tenantId) return;

    const socket = createSocket(tenantId);

    // socket.on("connect", () =>
    //   console.log(`Połączono z WebSocket jako tenant: ${tenantId}`)
    // );

    socket.on("order.updated", (payload) => {
      setOrders((current) =>
        current.map((order) =>
          order.orderId === payload.orderId
            ? { ...order, status: payload.status }
            : order
        )
      );
    });

    return () => {
      socket.off("order.updated"); // zawsze warto czyścić konkretne nasłuchy
      socket.off("connect");
      disconnectSocket();
    };
  }, [tenantId]);

  return (
    <Paper sx={{ padding: 2 }}>
      <Typography variant="h6" gutterBottom>
        Lista zamówień
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Buyer Email</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order.orderId}>
                  <TableCell>{order.orderId}</TableCell>
                  <TableCell>{order.buyerEmail}</TableCell>
                  <TableCell>
                    <Chip
                      label={order.status}
                      color={getStatusColor(order.status)}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>{order?.total?.toFixed(2) ?? 0}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={total}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
