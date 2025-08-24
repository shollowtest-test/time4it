export function getStatusColor(status: string) {
  switch (status.toLowerCase()) {
    case "paid":
      return "success"; // zielony
    case "cancelled":
      return "error"; // czerwony
    case "pending":
      return "info"; // niebieski
    default:
      return "default"; // szary
  }
}
