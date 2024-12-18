import Image, { ImageProps } from "next/image";

type props = Omit<ImageProps, "loader"> & {
  height?: number | string;
};

const SupabaseImage = (props: props) => {
  const { src, width, height, quality } = props;

  const mode: "fixedWidth" | "fixedHeight" | "crop" | undefined = width
    ? height
      ? "crop"
      : "fixedWidth"
    : height
    ? "fixedHeight"
    : undefined;
  if (!mode)
    throw new Error(
      "You must specify either width, height or both when defining SupabaseImage"
    );

  const supabaseImageLoader = () => {
    const url = new URL(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/render/image/public/polizarcie/images/${src}`
    );
    if (width && mode !== "fixedHeight")
      url.searchParams.set("width", width.toString());
    if (height && mode !== "fixedWidth")
      url.searchParams.set("height", height.toString());
    url.searchParams.set("quality", (quality || 75).toString());
    return url.href;
  };

  return (
    <Image
      {...props}
      width={width ? width : height}
      height={height ? height : width}
      loader={supabaseImageLoader}
      style={{
        ...props.style,
        width: mode === "fixedHeight" ? "auto" : undefined,
        height: mode === "fixedWidth" ? "auto" : undefined,
      }}
    />
  );
};

export default SupabaseImage;
