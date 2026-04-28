import { CheckInProvider } from "./context";
import VisitNotifier from "./VisitNotifier";

export default function CheckInDemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Wraps all /check-in-demo/* routes with shared state.
  // No visual chrome — each page owns its own layout.
  return (
    <CheckInProvider>
      <VisitNotifier />
      {children}
    </CheckInProvider>
  );
}
