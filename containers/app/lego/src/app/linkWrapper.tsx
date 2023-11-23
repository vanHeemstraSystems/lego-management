import React from "react";
import Link from "next/link";

// See https://github.com/mui/material-ui/issues/32882#issuecomment-1135784140
export const LinkWrapper = React.forwardRef(function LinkWrapper(
  props: any,
  ref: any
) {
  const { searchParams, ...pageProps } = props;
  return (
    <Link href={props.href} as={props.as} {...pageProps} ref={ref}>
      {props.name}
    </Link>
  );
});