// Renders JSON-LD as a body <script> (not in next/head, which Pages Router
// can duplicate/drop on client navigation).

interface JsonLdProps {
  data: Record<string, unknown> | Record<string, unknown>[];
}

// Several entities render as one @graph rather than a top-level array, so the
// root always carries @context. Scripts that read root["@context"] (Safari
// extensions) threw on the array form, reported as client.error.uncaught.
const toGraph = (data: JsonLdProps["data"]) =>
  Array.isArray(data)
    ? {
        "@context": "https://schema.org",
        "@graph": data.map(({ "@context": _context, ...node }) => node),
      }
    : data;

const JsonLd = ({ data }: JsonLdProps) => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(toGraph(data)) }}
  />
);

export default JsonLd;
