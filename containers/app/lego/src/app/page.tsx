"use client";
import "./page.scss";
import Image from 'next/image'
import { ApolloProvider } from "@apollo/client";
import { useApollo } from "../lib/apollo";
import Data from "../components/dynamicComponents";
import { LinkWrapper } from "./linkWrapper";

export default function Home(pageProps:any) {
  const client = useApollo(pageProps.initialApolloProps);
  return (
    <ApolloProvider client={client}>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
          <h2 className="fixed left-10 top-10">LEGO Management</h2>
          {Data.map((item: any, index: number) => {
            let href = "/bricks/brick";
            let as = "/bricks/brick";
            return (
              <p
                key={index}
                className="fixed left-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30"
              >
                Navigate to &nbsp;
                <LinkWrapper
                  href={href}
                  as={as}
                  name={item.name}
                  {...pageProps}
                />
                .
              </p>
            );
          })}
        </div>
      </main>
    </ApolloProvider>
  )
}
