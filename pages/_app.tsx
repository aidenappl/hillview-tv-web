import '../styles/globals.css'
import type { AppProps } from 'next/app'
import PageHead from '../components/PageHead'
import { Children, useEffect } from 'react'
import { useRouter } from 'next/router';
import axios from 'axios';

interface RouteGuardParams {
	children: any;
}

const LookupRoute = async (path: string) => {
  try {
    const response = await axios.get(`https://api.hillview.tv/links/v1.1/check/${path}`)
    return response.data
  } catch (error) {
    throw error
  }
} 

function HillviewWeb({ Component, pageProps }: AppProps) {

  const router = useRouter();

  const RouteProtection = (props: RouteGuardParams) => {
    const { children } = props;

    useEffect(async () => {
      const response = await LookupRoute(router.asPath)
      if (children.props.statusCode === 404 && router.asPath) {
        console.log(response)
        if (response.destination) {
          router.replace(response.destination)
          return
        }
      }
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
