import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// @ts-ignore
import { transform } from "@babel/standalone";
import { useApiService } from "../services/api";

const LandingPage = () => {
  const { startupName } = useParams<{ startupName: string }>();
  const { getLandingPageHtmlByStartupName } = useApiService();
  const [content, setContent] = useState<React.ReactNode>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      if (!startupName) {
        setError("Missing startup name.");
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const res = await getLandingPageHtmlByStartupName(startupName);

        console.log(typeof res, "res");
        if (isMounted) {
          // Extract the JSX string from the response
          const jsxString = res?.data?.landingPage || res || "";

          try {
            // Transform JSX to JavaScript
            const { code } = transform(jsxString, {
              presets: ["react"],
              plugins: ["transform-react-jsx"],
            });

            // Create a function that returns the JSX element
            const Component = new Function("React", `return ${code}`)(React);
            setContent(Component);
          } catch (parseError) {
            console.error("JSX parsing error:", parseError);
            setError("Failed to parse landing page JSX.");
          }
        }

        console.log(content, "content");
      } catch (e: any) {
        if (isMounted) {
          setError(e?.message || "Failed to load landing page.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, [startupName, getLandingPageHtmlByStartupName]);

  return (
    <>
      {!loading && error && (
        <div style={{ padding: 24, color: "#b91c1c" }}>{error}</div>
      )}
      {!loading && !error && content}
    </>
  );
};

export default LandingPage;
