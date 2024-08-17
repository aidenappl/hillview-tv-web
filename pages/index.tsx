import type { NextPage } from "next";
import Link from "next/link";
import Layout from "../components/Layout";
import Spinner from "../components/Spinner";
import { useState } from "react";
import Joi from "joi";
import toast from "react-hot-toast";
import { NewRequest } from "../services/http/requestHandler";

const Home: NextPage = () => {
  const [loadingNewsletter, setLoadingNewsletter] = useState<boolean>(false);
  const [newsletterEmail, setNewsletterEmail] = useState<string>("");

  const submitNewsletterForm = async () => {
    // Base checks
    if (loadingNewsletter) return;
    if (newsletterEmail == "") return;

    // Set loading newsletter
    setLoadingNewsletter(true);

    // Validate email
    let schema: Joi.ObjectSchema<any>;
    schema = Joi.object({
      email: Joi.string()
        .email({ tlds: { allow: false } })
        .required(),
    });
    let response = schema.validate({ email: newsletterEmail.trim() });
    if (response.error) {
      // Error handle bad email & exit flow
      toast.error("Must have a valid email address");
      setLoadingNewsletter(false);
      return;
    }

    // Submit to hillviewtv API
    const request = await NewRequest({
      route: "/newsletter",
      method: "POST",
      url: "https://api.hillview.tv/video/v1.1",
      body: {
        email: newsletterEmail,
      },
    });

    // Validate response from API
    if (!request.success) {
      // handle bad response & exit flow
      toast.error(request.message);
      setLoadingNewsletter(false);
      return;
    }

    setLoadingNewsletter(false);
    setNewsletterEmail("");
    toast.success("You're signed up! Expect a confirmation email shortly.");
  };

  return (
    <Layout>
      <div className="z-20 flex h-fit w-full flex-wrap items-center justify-center gap-4 bg-primary-500 px-6 py-5 md:absolute md:h-[90px] md:flex-nowrap md:gap-12">
        <h5 className="text-sm font-semibold text-center text-white sm:text-md md:text-left md:text-lg lg:text-xl">
          Want to be notified when a new production is uploaded?
        </h5>
        <div className="flex w-full max-w-[500px] gap-3 md:w-1/3">
          <input
            id="email-address"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={newsletterEmail}
            onChange={(e) => {
              setNewsletterEmail(e.target.value.trim());
            }}
            onKeyUp={(e) => {
              if (e.key == "Enter") {
                submitNewsletterForm();
              }
            }}
            className="focus:ring-indigo-500 min-w-0 flex-auto rounded-md border-0 bg-white/5 px-3.5 py-2 text-sm text-white shadow-sm ring-1 ring-inset ring-white/30 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
            placeholder="Enter your email"
          />
          <button
            type="submit"
            className="hover:bg-indigo-400 focus-visible:outline-indigo-500 flex w-[94px] flex-none items-center justify-center rounded-md bg-primary-550 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#181542] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            disabled={loadingNewsletter}
            onClick={() => {
              submitNewsletterForm();
            }}
          >
            <>
              {!loadingNewsletter ? (
                <span>Notify me</span>
              ) : (
                <Spinner style="light" size={20} />
              )}
            </>
          </button>
        </div>
      </div>
      <div className="absolute z-10 h-[calc(100%-300px)] w-full md:h-[calc(100%-100px)]">
        <div className="flex justify-between w-11/12 lander-content full-center h-fit max-w-screen-2xl">
          <div className="w-fit max-w-[50%]">
            <p className="text-5xl font-semibold text-header-100 sm:whitespace-nowrap sm:text-8xl 2xl:text-9xl">
              Good Morning <br></br>
              <b className="font-bold text-white header-stroke">Hillview</b>
            </p>
            <p className="my-5 text-md whitespace-nowrap text-header-200 sm:text-2xl">
              Putting the spotlight on the stories <br></br>that matter.
            </p>
            <Link href="/content">
              <a>
                <button className="sm:text-md my-4 rounded-md bg-primary-100 px-6 py-2.5 text-sm font-semibold text-white 2xl:my-10">
                  The Latest
                </button>
              </a>
            </Link>
          </div>
          <div className="hidden w-fit max-w-[50%] lg:block">
            <div className="full-vertical sun relative h-[20rem] w-[20rem] bg-[url('/assets/logos/sun.png')] bg-cover bg-center bg-no-repeat 2xl:h-[30rem] 2xl:w-[30rem]"></div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export async function getStaticProps() {
  return {
    props: {
      title: "HillviewTV - Home",
    },
  };
}

export default Home;
