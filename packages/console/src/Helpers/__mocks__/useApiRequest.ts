import { useState } from "react";

/**
 * Mock of the `useApiRequest` file.
 */
function useApiRequestMock() {
  const [data] = useState<any>([]);
  return { data };
}

export default useApiRequestMock;
