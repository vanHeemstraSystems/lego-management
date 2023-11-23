import { useMemo } from "react";
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const createApolloClient = () => {
  return new ApolloClient({
    link: new HttpLink({
      uri: "http://REPLACE_BY_IP_ADDRESS:REPLACE_BY_PORT/v1/graphql",
      headers: {
        "Content-Type": "application/json",
        "x-hasura-admin-secret": "secret"
      }
    }),
    cache: new InMemoryCache()
  });
};

let apolloClient;

export default function initializeApollo(initialState = null) {
  const _apolloClient = apolloClient ? apolloClient : createApolloClient();

  if (initialState) {
    const existingCache = _apolloClient.extract();
    _apolloClient.cache.restore({ ...existingCache, ...initialState });
  }
  // if the mode is server-side render (ssr)
  if (typeof window === "undefined") return _apolloClient;

  // else create client once on the frontend
  if (!apolloClient) apolloClient = _apolloClient;

  return _apolloClient;
}

export function useApollo(initialState) {
  const store = useMemo(() => initializeApollo(initialState), [initialState]);
  return store;
}

// More ... see video at time: https://youtu.be/CICBihCe7hQ?t=2544