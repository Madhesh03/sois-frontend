import { redirect } from "next/navigation";

// Compatibility shim for order emails sent before the CTA was fixed: those
// links point at /orders/<order_number>, which never had a route. The real
// order page lives under the account area and resolves an order by id *or*
// order_number, so forward there. New emails link straight to
// /account/orders/<id> and never hit this route.
export default async function LegacyOrderRedirect({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;
  redirect(`/account/orders/${orderNumber}`);
}
