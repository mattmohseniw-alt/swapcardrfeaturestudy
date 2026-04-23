import { CheckInProvider } from "./context";

export default function CheckInDemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Wraps all /check-in-demo/* routes with shared state.
  // No visual chrome — each page owns its own layout.
  return <CheckInProvider>{children}</CheckInProvider>;
}
