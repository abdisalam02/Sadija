import React, { createContext, useContext, useState } from 'react';
import { CreatorConfig, defaultCreatorConfig } from '../config/creatorConfig';

interface CreatorContextValue {
  creator: CreatorConfig;
  setCreator: React.Dispatch<React.SetStateAction<CreatorConfig>>;
  updateCreator: (updates: Partial<CreatorConfig>) => void;
}

const CreatorContext = createContext<CreatorContextValue>({
  creator: defaultCreatorConfig,
  setCreator: () => {},
  updateCreator: () => {},
});

export const CreatorProvider: React.FC<{
  initialConfig?: CreatorConfig;
  children: React.ReactNode;
}> = ({ initialConfig = defaultCreatorConfig, children }) => {
  const [creator, setCreator] = useState<CreatorConfig>(initialConfig);

  const updateCreator = (updates: Partial<CreatorConfig>) => {
    setCreator((prev) => ({ ...prev, ...updates }));
  };

  return (
    <CreatorContext.Provider value={{ creator, setCreator, updateCreator }}>
      {children}
    </CreatorContext.Provider>
  );
};

export const useCreatorContext = () => useContext(CreatorContext);

export const useCreator = (override?: Partial<CreatorConfig>): CreatorConfig => {
  const context = useContext(CreatorContext);
  const base = context ? context.creator : defaultCreatorConfig;
  if (!override) return base;
  return { ...base, ...override };
};
