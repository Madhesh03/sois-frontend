import { redirect } from "next/navigation";

// The Refund Policy is now part of the unified Returns, Refunds & Exchange
// Policy — keep this URL alive (existing links/bookmarks/emails) and send
// visitors to the single source of truth instead of maintaining duplicate,
// driftable copy.
export default function RefundPolicyPage() {
  redirect("/return-policy");
}
