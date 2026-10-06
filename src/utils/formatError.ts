/**
 * Helper utility to safely convert any error value (string, Error instance, Axios response object, or generic object)
 * into a human-readable string for React JSX rendering, preventing React Error #31 (Objects are not valid as a React child).
 */
export const formatError = (error: any): string => {
  if (!error) return '';
  if (typeof error === 'string') return error;

  // Handle Axios response error objects
  if (error?.response?.data?.error) {
    const apiErr = error.response.data.error;
    if (typeof apiErr === 'string') return apiErr;
    if (typeof apiErr === 'object' && apiErr?.message) return String(apiErr.message);
    if (typeof apiErr === 'object') return JSON.stringify(apiErr);
  }

  if (error?.response?.data?.message) return String(error.response.data.message);
  if (error?.message) return String(error.message);

  if (typeof error === 'object') {
    try {
      return JSON.stringify(error);
    } catch {
      return String(error);
    }
  }

  return String(error);
};
