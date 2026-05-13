import { createContext, useContext } from 'react';

/**
 * Context value: a `t(key, vars?)` function returned by `getT(lang)`.
 * Defaults to a passthrough that returns the key, so components never crash
 * if used outside the provider.
 */
export const I18nContext = createContext((key) => key);

/** @returns {(key: string, vars?: Record<string, string|number>) => string} */
export function useTranslation() {
  return useContext(I18nContext);
}
