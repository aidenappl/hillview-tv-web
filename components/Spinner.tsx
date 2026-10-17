interface Props {
  wrapperClass?: string;
  size?: number;
  style?: SpinnerStyles;
}

type SpinnerStyles = "default" | "light";

// A ring with one darker quarter, rotating. Plain CSS (Tailwind animate-spin):
// the old react-loader-spinner pulled in styled-components.
const Spinner = (props: Props) => {
  const { wrapperClass, size = 30, style = "default" } = props;
  const colors =
    style === "default"
      ? "border-[#38414f]/40 border-t-[#192536]"
      : "border-[#fefefe]/40 border-t-[#fefefe]";
  return (
    <div className={wrapperClass} role="status" aria-label="oval-loading">
      <div
        className={`animate-spin rounded-full ${colors}`}
        style={{
          width: size,
          height: size,
          borderWidth: Math.max(2, Math.round(size / 8)),
        }}
      />
    </div>
  );
};

export default Spinner;
