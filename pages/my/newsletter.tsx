import { NextPage } from "next";
import { useEffect, useState } from "react";
import Spinner from "../../components/Spinner";
import { NewRequest } from "../../services/http/requestHandler";
import Link from "next/link";

const MyNewsletter: NextPage = () => {
  const [email, setEmail] = useState<string>("");
  const [loadingNewsletter, setLoadingNewsletter] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  useEffect(() => {
    // get email from query params
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get("email");
    if (email) {
      setEmail(email);
    }
  }, []);

  return (
    <div className="flex flex-wrap justify-center w-full pt-20 text-center">
      <div className="flex max-w-[1000px] flex-wrap justify-center">
        <h1 className="w-full text-2xl font-semibold text-center">
          HillviewTV Newsletter
        </h1>
        {!success ? (
          <>
            <p className="py-4">
              Manage your HillviewTV newsletter, if you want to unsubscribe{" "}
              <i>{email}</i> from all future notifications please select
              unsubscribe. You can return to this page or resubscribe on the
              home page to restart your HillviewTV Newsletter.
            </p>
            <button
              className="flex w-[140px] items-center justify-center rounded-md bg-primary-100 px-3.5 py-2.5 text-sm font-semibold text-white shadow"
              onClick={async () => {
                // handle unsubscribe
                if (loadingNewsletter) return;
                setLoadingNewsletter(true);

                // Submit to hillviewtv API
                const response = await NewRequest({
                  route: "/newsletter/unsubscribe",
                  method: "POST",
                  url: "https://api.hillview.tv/video/v1.1",
                  body: {
                    email: email,
                  },
                });
                if (!response.success) {
                  // handle bad response & exit flow
                  setLoadingNewsletter(false);
                  return;
                }

                setSuccess(true);
              }}
            >
              <>
                {!loadingNewsletter ? (
                  <span>Unsubscribe</span>
                ) : (
                  <Spinner style="light" size={20} />
                )}
              </>
            </button>
          </>
        ) : (
          <>
            <p className="w-full py-4">
              Successfully unsubscribed {email} from all future notifications.
            </p>
            <Link href={"/"}>
              <a className="flex w-[140px] items-center justify-center rounded-md bg-primary-100 px-3.5 py-2.5 text-sm font-semibold text-white shadow">
                Go Home
              </a>
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default MyNewsletter;
