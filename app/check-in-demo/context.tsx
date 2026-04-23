"use client";

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useRef,
  useEffect,
} from "react";
import type { Attendee, AppState, Action, CheckedInBy } from "@/components/CheckInDemo/types";
import { reducer, INITIAL_STATE } from "@/components/CheckInDemo/types";

// ─── Context shape ────────────────────────────────────────────────────────────

interface CheckInCtx {
  state: AppState;
  /** Check in a single attendee, optionally specifying who triggered it */
  checkIn: (attendeeId: number, by?: CheckedInBy) => void;
  /** Check in all attendees matching the predicate (e.g. by type) */
  checkInBatch: (predicate: (a: Attendee) => boolean, by?: CheckedInBy) => void;
  /** Reset all check-in state */
  reset: () => void;
}

const CheckInContext = createContext<CheckInCtx | null>(null);

// ─── Provider ────────────────────────────────────────────────────────────────

export function CheckInProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  // Keep a ref to current state so callbacks never go stale without re-creating
  const stateRef = useRef(state);
  useEffect(() => { stateRef.current = state; }, [state]);

  // Track in-flight check-ins to prevent duplicate dispatch races
  const inflightRef = useRef(new Set<number>());

  const checkIn = useCallback((attendeeId: number, by: CheckedInBy = "self") => {
    if (stateRef.current.checkedIn[attendeeId]) return;
    if (inflightRef.current.has(attendeeId)) return;

    inflightRef.current.add(attendeeId);
    dispatch({ type: "CHECK_IN", attendeeId, checkedInBy: by });

    setTimeout(() => dispatch({ type: "SET_KIOSK", status: "success" }), 350);
    setTimeout(() => {
      dispatch({ type: "SET_KIOSK", status: "idle" });
      inflightRef.current.delete(attendeeId);
    }, 3350);
  }, []);

  const checkInBatch = useCallback(
    (predicate: (a: Attendee) => boolean, by: CheckedInBy = "staff") => {
      const targets = stateRef.current.attendees.filter(
        (a) =>
          predicate(a) &&
          !stateRef.current.checkedIn[a.id] &&
          !inflightRef.current.has(a.id)
      );
      if (!targets.length) return;

      targets.forEach((a) => {
        inflightRef.current.add(a.id);
        dispatch({ type: "CHECK_IN", attendeeId: a.id, checkedInBy: by });
      });

      setTimeout(() => dispatch({ type: "SET_KIOSK", status: "success" }), 350);
      setTimeout(() => {
        dispatch({ type: "SET_KIOSK", status: "idle" });
        targets.forEach((a) => inflightRef.current.delete(a.id));
      }, 3350);
    },
    []
  );

  const reset = useCallback(() => {
    inflightRef.current.clear();
    dispatch({ type: "RESET" });
  }, []);

  return (
    <CheckInContext.Provider value={{ state, checkIn, checkInBatch, reset }}>
      {children}
    </CheckInContext.Provider>
  );
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useCheckIn(): CheckInCtx {
  const ctx = useContext(CheckInContext);
  if (!ctx) throw new Error("useCheckIn must be used inside <CheckInProvider>");
  return ctx;
}
