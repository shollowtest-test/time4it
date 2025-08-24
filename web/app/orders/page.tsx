import { getTenantIdFromCookie } from "@/lib/getTenantIdFromCookie";
import { fetchOrders } from "../actions/fetchOrders";
import { CreateOrderForm } from "../components/OrdersPage/CreateMockupOrder";
import OrdersList from "../components/OrdersPage/OrderList";

const OrdersPage = async () => {
  const tenantId = await getTenantIdFromCookie(); // lub pobierane z auth/context
  const data = await fetchOrders();

  return (
    <main className="p-5 flex flex-col gap-3">
      <div className="bg-amber-50 p-5">
        <CreateOrderForm />
      </div>
      <OrdersList
        initialItems={data.items}
        initialPage={data?.page ?? 1}
        initialLimit={data.limit ?? 10}
        initialTotal={data.total ?? 0}
        tenantId={tenantId}
      />
    </main>
  );
};

export default OrdersPage;
