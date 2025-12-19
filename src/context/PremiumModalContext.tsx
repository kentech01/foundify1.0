import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { PremiumUpgradeModal } from "../components/PremiumUpgradeModal";
import { setPremiumModalCallback } from "../hooks/useAxios";

interface PremiumModalContextType {
  showPremiumModal: (featureName?: string) => void;
  hidePremiumModal: () => void;
}

const PremiumModalContext = createContext<PremiumModalContextType | undefined>(
  undefined
);

export function PremiumModalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [featureName, setFeatureName] = useState<string>("this feature");

  const showPremiumModal = useCallback((name?: string) => {
    setFeatureName(name || "this feature");
    setIsOpen(true);
  }, []);

  const hidePremiumModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Register the callback with the axios interceptor
  useEffect(() => {
    setPremiumModalCallback(showPremiumModal);
    return () => {
      setPremiumModalCallback(null);
    };
  }, [showPremiumModal]);

  return (
    <PremiumModalContext.Provider
      value={{ showPremiumModal, hidePremiumModal }}
    >
      {children}
      <PremiumUpgradeModal
        isOpen={isOpen}
        onClose={hidePremiumModal}
        featureName={featureName}
      />
    </PremiumModalContext.Provider>
  );
}

export function usePremiumModal() {
  const context = useContext(PremiumModalContext);
  if (!context) {
    throw new Error(
      "usePremiumModal must be used within a PremiumModalProvider"
    );
  }
  return context;
}

