// Renders JSON-LD as a body <script> (not in next/head, which Pages Router
// can duplicate/drop on client navigation).

interface JsonLdProps {
  data: Record<string, unknown> | Record<string, unknown>[];
}

const JsonLd = ({ data }: JsonLdProps) => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
  />
);

export default JsonLd;
