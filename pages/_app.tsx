import '../styles/globals.css'
import type { AppProps } from 'next/app'
import PageHead from '../components/PageHead'
import { Children, useEffect } from 'react'
import { useRouter } from 'next/router';

interface RouteGuardParams {
	children: any;
}

function HillviewWeb({ Component, pageProps }: AppProps) {

  const router = useRouter();

  const RouteProtection = (props: RouteGuardParams) => {
    const { children } = props;

    useEffect(() => {
      if (children.props.redirect !== undefined) {
        router.push({
            pathname: children.props.redirect,
        });
        return
      } else {
        return
      }
   })

   return children;
  } 

  return ( 
    <>
      <PageHead title={pageProps.title} description={pageProps.description} image={pageProps.image}/>
      <RouteProtection>
        <Component {...pageProps} />
      </RouteProtection>
    </>
  )
}

export default HillviewWeb
