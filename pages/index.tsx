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
      <div className="px-10 w-full h-fit flex-wrap gap-4 py-6 md:gap-12 md:flex-nowrap md:h-[90px] bg-primary-500 md:absolute flex items-center justify-center z-20">
        <h5 className="text-center md:text-left text-white text-md sm:text-lg lg:text-xl font-semibold">
          Want to be notified when a new production is uploaded?
        </h5>
        <div className="flex gap-3 w-full md:w-1/3 max-w-[500px]">
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
            className="text-sm min-w-0 flex-auto rounded-md border-0 bg-white/5 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-white/30 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
            placeholder="Enter your email"
          />
          <button
            type="submit"
            className="flex-none rounded-md bg-primary-550 hover:bg-[#181542] w-[94px] flex items-center justify-center py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
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
      <div className="w-full h-[calc(100%-300px)] md:h-[calc(100%-100px)] absolute z-10">
        <div className="lander-content h-fit full-center w-11/12 max-w-screen-2xl flex justify-between">
          <div className="w-fit max-w-[50%]">
            <p className="text-7xl sm:text-8xl 2xl:text-9xl font-semibold text-header-100 sm:whitespace-nowrap">
              Good Morning <br></br>
              <b className="font-bold header-stroke text-white">Hillview</b>
            </p>
            <p className="text-header-200 text-xl sm:text-2xl my-5 whitespace-nowrap">
              Putting the spotlight on the stories <br></br>that matter.
            </p>
            <Link href="/content">
              <a>
                <button className="w-[10rem] h-[44px] text-white bg-primary-100 rounded-md font-semibold my-4 2xl:my-10">
                  The Latest
                </button>
              </a>
            </Link>
          </div>
          <div className="w-fit max-w-[50%] hidden lg:block">
            <div className="relative full-vertical sun bg-[url('/assets/logos/sun.png')] w-[20rem] 2xl:w-[30rem] h-[20rem] 2xl:h-[30rem] bg-no-repeat bg-cover bg-center"></div>
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
