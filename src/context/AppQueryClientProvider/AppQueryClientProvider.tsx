import { QueryClientProvider, QueryClient } from "react-query";

import queryConfig from "services/api/config/queryConfig";

interface Props {
  children: React.ReactElement;
}

const getReactQueryClient = () =>
  new QueryClient({
    defaultOptions: queryConfig,
  });

/**
 * Wraps QueryClientProvider from react-query and provides it with the appropriate client
 */
const AppQueryClientProvider = ({ children }: Props) => {
  return (
    <QueryClientProvider client={getReactQueryClient()}>
      {children}
    </QueryClientProvider>
  );
};

export default AppQueryClientProvider;
