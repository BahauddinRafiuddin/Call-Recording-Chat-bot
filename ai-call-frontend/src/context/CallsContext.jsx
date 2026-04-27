import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getCalls } from "../api/calls.api";

const CallsContext = createContext(null);

export const CallsProvider = ({ children }) => {
  const [calls, setCalls] = useState([]);

  const fetchCalls = useCallback(async () => {
    const res = await getCalls();
    setCalls(res.data);
  }, []);

  useEffect(() => {
    fetchCalls();
    const id = setInterval(fetchCalls, 3000);
    return () => clearInterval(id);
  }, [fetchCalls]);

  return (
    <CallsContext.Provider value={{ calls, fetchCalls }}>
      {children}
    </CallsContext.Provider>
  );
};

export const useCalls = () => useContext(CallsContext);