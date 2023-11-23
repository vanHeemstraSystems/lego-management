"use client";
import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { ApolloProvider } from "@apollo/client";
import { useApollo } from "../../lib/apollo";
import { Provider } from "react-redux";
import configureStore from "../../store/configureStore";
import Playground from "../../components/playground";
import "./brick.scss";

export default function Map(pageProps: any) {
    const client = useApollo(pageProps.initialApolloProps);
    const name = pageProps.name;

    useEffect(() => {
        const store = configureStore();
        const root = ReactDOM.createRoot(
          document.getElementById("root") as HTMLElement
        );
    
        root.render(
          <ApolloProvider client={client}>
            <Provider store={store}>
              <Playground name={'ScoobyDoo'} />
            </Provider>
          </ApolloProvider>
        );
    });

    return (
        <>
          <noscript>You need to enable JavaScript to run this app.</noscript>
          <div id="root"></div>
        </>
      );
}    