import { ImageResponse } from "next/og"

// Route segment config
export const runtime = "edge"

// Image metadata
export const alt = "About Acme"
export const size = {
  width: 1200,
  height: 630
}

export const contentType = "image/png"

// Image generation
export default async function Image() {
  // Font
  // const interSemiBold = fetch(
  //   new URL("./Inter-SemiBold.ttf", import.meta.url)
  // ).then(res => res.arrayBuffer())

  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          fontSize: 128,
          background: "white",
          backgroundImage:
            "radial-gradient(circle at 25px 25px, lightgray 2%, transparent 0%), radial-gradient(circle at 75px 75px, lightgray 2%, transparent 0%)",
          backgroundSize: "100px 100px",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <svg
          width="200"
          height="200"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M76.38 15.343C76.364 14.542 75.817 14.089 75.209 13.865L46.476 6.363C45.8 6.194 45.081 6 44.408 6C43.732 6 43.093 6.145 42.519 6.417L41.819 6.822L14.325 22.793C14.234 22.854 14.146 22.92 14.058 22.986C9.767 25.815 9 28.832 9 32.198V63.832C9 65.446 9.858 66.86 11.147 67.641L11.177 67.66L38.838 83.618C39.138 83.8 39.493 83.905 39.869 83.905C40.967 83.905 41.858 83.016 41.858 81.923V49.929C41.858 48.394 41.079 47.042 39.896 46.241L39.278 45.89L16.86 33.248C15.135 32.229 14.98 30.235 15.496 29.038C16.239 27.327 18.061 26.997 19.328 27.306L42.656 33.282C43.441 33.463 44.005 33.626 44.712 33.626C45.427 33.626 46.103 33.46 46.704 33.161L47.104 32.934L75.183 17.099C75.694 16.742 76.398 16.138 76.38 15.343ZM77.935 26.964L71.019 23.159L65.483 26.366C65.483 26.366 71.832 29.866 72.902 30.591C74.197 31.467 73.687 32.755 72.832 33.236L50.399 45.891L49.79 46.233C49.787 46.236 49.783 46.239 49.78 46.242C48.594 47.043 47.819 48.394 47.819 49.93V81.922C47.819 83.016 48.707 83.904 49.804 83.904C50.147 83.904 50.471 83.816 50.753 83.663C50.78 83.65 50.808 83.635 50.835 83.617L78.486 67.664L78.525 67.641C79.811 66.861 80.671 65.447 80.671 63.832V32.199C80.673 29.439 79.988 28.119 77.935 26.964Z"
            fill="black"
          />
        </svg>
        Cargo
      </div>
    ),
    // ImageResponse options
    {
      // For convenience, we can re-use the exported opengraph-image
      // size config to also set the ImageResponse's width and height.
      ...size
      // fonts: [
      //   {
      //     name: "Inter",
      //     data: await interSemiBold,
      //     style: "normal",
      //     weight: 400
      //   }
      // ]
    }
  )
}
