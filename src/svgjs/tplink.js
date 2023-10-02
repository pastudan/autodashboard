import * as React from "react";
const SvgTplink = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 100 100"
    {...props}
  >
    <g clipPath="url(#tplink_svg__a)">
      <path
        fill="#4ACBD6"
        d="M1 69.6c0 2.599 2.177 5.199 5.146 5.199h19.801V94.8c0 2.6 2.177 5.2 5.146 5.2h16.93V52.5H1v17.1ZM63.764 0c-20.69 0-37.22 16.6-37.22 37.097v7.902H47.33v-7.902C47.33 28.199 54.557 21 63.764 21c9.107 0 15.444 6.398 15.444 15.897 0 9.402-6.832 16.301-15.943 16.301h-7.819v20.994h7.82c20.3 0 36.734-16.694 36.734-37.298C100 15.5 84.656 0 63.764 0"
      />
    </g>
    <defs>
      <clipPath id="tplink_svg__a">
        <path fill="#fff" d="M0 0h100v100H0z" />
      </clipPath>
    </defs>
  </svg>
);
export default SvgTplink;
