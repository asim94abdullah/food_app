import * as React from "react";
import Svg, { G, Image, Rect, Path } from "react-native-svg";
const QR_code = (props) => (
  <Svg
    id="Group_1034"
    data-name="Group 1034"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    width={160.375}
    height={160.375}
    viewBox="0 0 160.375 160.375"
    {...props}
  >
    <G id="Group_1032" data-name="Group 1032">
      <Image
        id="Rectangle_26"
        data-name="Rectangle 26"
        width={160.375}
        height={160.375}
        opacity={0.25}
        xlinkHref="data:image/png;base64,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"
        style={{
          mixBlendMode: "multiply",
          isolation: "isolate",
        }}
      />
      <G
        id="Group_1031"
        data-name="Group 1031"
        transform="translate(12.652 12.597)"
      >
        <G id="Group_1030" data-name="Group 1030">
          <Rect
            id="Rectangle_27"
            data-name="Rectangle 27"
            width={113.499}
            height={113.499}
            rx={10.133}
            fill="#fff"
          />
        </G>
      </G>
    </G>
    <Path
      id="Path_1002"
      data-name="Path 1002"
      d="M517.417,506.954h9.928a6.687,6.687,0,0,0,6.687-6.685v-9.929a6.686,6.686,0,0,0-6.687-6.685h-9.928a6.686,6.686,0,0,0-6.687,6.685v9.929A6.687,6.687,0,0,0,517.417,506.954ZM514.549,490.7a3.226,3.226,0,0,1,3.227-3.225h9.208a3.226,3.226,0,0,1,3.227,3.225v9.21a3.226,3.226,0,0,1-3.227,3.225h-9.208a3.226,3.226,0,0,1-3.227-3.225Z"
      transform="translate(-482.01 -455.061)"
      fill="#1f2124"
    />
    <Rect
      id="Rectangle_28"
      data-name="Rectangle 28"
      width={9.168}
      height={9.168}
      rx={1.741}
      transform="translate(35.787 35.659)"
      fill="#1f2124"
    />
    <Rect
      id="Rectangle_29"
      data-name="Rectangle 29"
      width={2.911}
      height={2.911}
      transform="translate(69.62 28.592)"
      fill="#1f2124"
    />
    <Rect
      id="Rectangle_30"
      data-name="Rectangle 30"
      width={2.911}
      height={2.911}
      transform="translate(81.263 48.969)"
      fill="#1f2124"
    />
    <Path
      id="Path_1003"
      data-name="Path 1003"
      d="M571.906,502.516H569v2.911H566.23v-2.911h-5.821v2.911H557.5v-2.911h-2.911v2.911h2.766v2.912h-2.766v-2.912h-5.968v-2.911H542.8v2.911h2.911v2.912h8.733v4.194H566.1v1.63H569v1.624H569v1.284h2.911v-.006h.008v-5.813h2.9v-5.823h-2.912Zm-5.821,5.823h-2.911v-2.912h2.911Z"
      transform="translate(-464.59 -444.814)"
      fill="#1f2124"
    />
    <Rect
      id="Rectangle_31"
      data-name="Rectangle 31"
      width={2.911}
      height={2.911}
      transform="translate(92.907 54.791)"
      fill="#1f2124"
    />
    <Rect
      id="Rectangle_32"
      data-name="Rectangle 32"
      width={2.911}
      height={2.911}
      transform="translate(63.507 28.592)"
      fill="#1f2124"
    />
    <Path
      id="Path_1004"
      data-name="Path 1004"
      d="M539.127,488.305h-2.911V485.54h-2.911v2.765H527.85v2.911h11.277Z"
      transform="translate(-472.709 -454.037)"
      fill="#1f2124"
    />
    <Path
      id="Path_1005"
      data-name="Path 1005"
      d="M530.394,483.654H527.85v2.911h5.455v-2.911Z"
      transform="translate(-472.709 -455.061)"
      fill="#1f2124"
    />
    <Rect
      id="Rectangle_33"
      data-name="Rectangle 33"
      width={2.911}
      height={2.911}
      transform="translate(46.332 54.791)"
      fill="#1f2124"
    />
    <Path
      id="Path_1006"
      data-name="Path 1006"
      d="M565.062,483.654h-9.928a6.686,6.686,0,0,0-6.687,6.685v9.929a6.687,6.687,0,0,0,6.687,6.685h9.928a6.687,6.687,0,0,0,6.687-6.685v-9.929A6.686,6.686,0,0,0,565.062,483.654Zm2.866,16.255a3.225,3.225,0,0,1-3.225,3.225h-9.21a3.226,3.226,0,0,1-3.226-3.225V490.7a3.226,3.226,0,0,1,3.226-3.225h9.21a3.225,3.225,0,0,1,3.225,3.225Z"
      transform="translate(-461.52 -455.061)"
      fill="#1f2124"
    />
    <Rect
      id="Rectangle_34"
      data-name="Rectangle 34"
      width={9.168}
      height={9.168}
      rx={1.741}
      transform="translate(93.993 35.659)"
      fill="#1f2124"
    />
    <Rect
      id="Rectangle_35"
      data-name="Rectangle 35"
      width={2.911}
      height={2.911}
      transform="translate(81.118 107.043)"
      fill="#1f2124"
    />
    <Rect
      id="Rectangle_36"
      data-name="Rectangle 36"
      width={2.911}
      height={2.911}
      transform="translate(107.317 78.079)"
      fill="#1f2124"
    />
    <Rect
      id="Rectangle_37"
      data-name="Rectangle 37"
      width={2.911}
      height={2.911}
      transform="translate(104.406 75.168)"
      fill="#1f2124"
    />
    <Rect
      id="Rectangle_38"
      data-name="Rectangle 38"
      width={2.911}
      height={2.911}
      transform="translate(107.317 72.257)"
      fill="#1f2124"
    />
    <Rect
      id="Rectangle_39"
      data-name="Rectangle 39"
      width={2.911}
      height={2.911}
      transform="translate(92.762 72.257)"
      fill="#1f2124"
    />
    <Path
      id="Path_1007"
      data-name="Path 1007"
      d="M549.48,514.859v-2.911h-2.911v5.822H555.3v-2.911H549.48Z"
      transform="translate(-462.54 -439.69)"
      fill="#1f2124"
    />
    <Rect
      id="Rectangle_40"
      data-name="Rectangle 40"
      width={3.202}
      height={2.911}
      transform="translate(66.418 75.022)"
      fill="#1f2124"
    />
    <Path
      id="Path_1008"
      data-name="Path 1008"
      d="M557.025,511.688v-1.626h-2.911v2.911h2.911Z"
      transform="translate(-458.441 -440.715)"
      fill="#1f2124"
    />
    <Rect
      id="Rectangle_41"
      data-name="Rectangle 41"
      width={2.911}
      height={2.911}
      transform="translate(55.065 107.043)"
      fill="#1f2124"
    />
    <Rect
      id="Rectangle_42"
      data-name="Rectangle 42"
      width={2.911}
      height={2.911}
      transform="translate(60.887 107.043)"
      fill="#1f2124"
    />
    <Rect
      id="Rectangle_43"
      data-name="Rectangle 43"
      width={2.911}
      height={2.911}
      transform="translate(66.563 107.043)"
      fill="#1f2124"
    />
    <Rect
      id="Rectangle_44"
      data-name="Rectangle 44"
      width={2.911}
      height={2.911}
      transform="translate(107.317 86.812)"
      fill="#1f2124"
    />
    <Rect
      id="Rectangle_45"
      data-name="Rectangle 45"
      width={2.911}
      height={2.911}
      transform="translate(104.406 89.723)"
      fill="#1f2124"
    />
    <Rect
      id="Rectangle_46"
      data-name="Rectangle 46"
      width={2.911}
      height={2.911}
      rx={0.49}
      transform="translate(89.851 86.812)"
      fill="#1f2124"
    />
    <Rect
      id="Rectangle_47"
      data-name="Rectangle 47"
      width={9.168}
      height={9.168}
      rx={1.741}
      transform="translate(35.642 93.72)"
      fill="#1f2124"
    />
    <G
      id="Group_1033"
      data-name="Group 1033"
      transform="translate(28.575 31.504)"
    >
      <Path
        id="Path_1009"
        data-name="Path 1009"
        d="M525.053,504.4h-2.911v5.822h2.911v-2.911h2.911V504.4Z"
        transform="translate(-504.385 -475.293)"
        fill="#1f2124"
      />
      <Rect
        id="Rectangle_48"
        data-name="Rectangle 48"
        width={2.911}
        height={2.911}
        transform="translate(14.846 26.198)"
        fill="#1f2124"
      />
      <Path
        id="Path_1010"
        data-name="Path 1010"
        d="M522.468,503.556V500.6h-2.911v2.954h-2.911l-.022-2.954-5.8.043v11.643h0v2.91h5.837v-2.91h5.807v-2.911h-5.822v2.91h-2.911v-5.821h8.733v2.911h2.911v-2.911h-2.911Z"
        transform="translate(-510.533 -477.358)"
        fill="#1f2124"
      />
      <Path
        id="Path_1011"
        data-name="Path 1011"
        d="M549.192,526.288H552v-2.84h2.878v2.844h2.911v-2.844h.017v-.063h2.9v2.907h5.821v-2.911h-5.815v-2.909H560.7v0h-8.588v-2.911H549.2v-2.912h-2.911v-5.821h-5.823v2.911h-2.911v5.823h-2.911v-2.912h-2.912v-5.821h2.912v2.911h2.911v-5.821h2.911V503h-3.057v-2.911h3.057V503h2.911v2.912h2.912v2.911H549.2V503h5.821v-5.821h-2.911v-2.911h-5.821v-2.912H549.2v-2.911h5.821v2.911h-2.911v2.912h5.624V485.54H546.292v2.911H543.38v8.733h-5.821v-2.911h-2.911v2.911h-2.912v-2.911H528.9V503h2.835v-2.911H534.5V503h-2.766v2.912h-2.911v11.644h-2.911v2.911h2.911v-2.911h2.911v2.911H549.2v0h-2.954v5.674H543.38v2.911H549.2v-2.766Zm.091-4.532h2.648v1.622h-2.648Zm-2.991-24.572H549.2v2.911h-2.911Zm0,20.377h-5.823v-2.912h5.823Z"
        transform="translate(-502.336 -485.54)"
        fill="#1f2124"
      />
      <Path
        id="Path_1012"
        data-name="Path 1012"
        d="M521.255,515.782h2.911v-2.891h2.912v2.891h2.911v-2.891h5.821v2.891h5.823v2.912h-2.911V521.6h2.911v2.911h5.821v-5.821h-2.911v-2.912h2.911v-2.911h-5.775v-2.892H524.143v2.892h-3.029v-2.892H518.2v1.753h0v1.139h-2.764v2.911h-2.912v8.733a2.9,2.9,0,0,0,2.9,2.9h2.924v-2.9h-2.91v-5.821h2.91V521.6h2.911v-5.823Z"
        transform="translate(-509.611 -472.263)"
        fill="#1f2124"
      />
      <Rect
        id="Rectangle_49"
        data-name="Rectangle 49"
        width={2.911}
        height={2.911}
        transform="translate(0 40.608)"
        fill="#1f2124"
      />
      <Path
        id="Path_1013"
        data-name="Path 1013"
        d="M531.013,524.345H525.19v-2.9h5.823v-5.821H525.19v2.911H522.28v5.809l-4.022,0a7.63,7.63,0,0,0-7.622,7.63v8.98a6.687,6.687,0,0,0,6.687,6.687h9.928a6.687,6.687,0,0,0,6.687-6.687V524.345h-.014v-2.9h-2.911Zm-.9,16.255a3.225,3.225,0,0,1-3.225,3.225h-9.21a3.226,3.226,0,0,1-3.225-3.225v-9.21a3.226,3.226,0,0,1,3.225-3.225h7.6A4.834,4.834,0,0,1,530.116,533Z"
        transform="translate(-510.636 -469.196)"
        fill="#1f2124"
      />
      <Rect
        id="Rectangle_50"
        data-name="Rectangle 50"
        width={2.911}
        height={2.911}
        transform="translate(20.377 43.519)"
        fill="#1f2124"
      />
      <Path
        id="Path_1014"
        data-name="Path 1014"
        d="M581.18,535.236h-5.821v2.911h-5.823v-2.911h5.823v-2.912h-2.911v-8.732h2.911V526.5h2.911v-2.911h2.911V520.68h-2.911V517.77h-2.911v-2.911h2.911v-2.912h-5.821v5.823h-2.912v2.911H557.892v2.912h-5.676V520.68h2.91V517.77h-2.91v-3.057h-2.911v5.968h-2.911V517.77h-2.912V526.5h5.676v2.911h2.912V526.5h5.821v8.733h-8.733v2.911h-2.911v2.766h-5.676v-5.676h8.587v-5.823h-2.911v2.911h-2.765V526.5h-2.911v2.766h-2.91v-2.912h-3.2v-2.911h-2.911v-2.911h-2.912v-2.911h-2.911v5.821h5.823v2.911h-2.406v8.733h2.7v-5.821h2.912v2.911h5.821v2.911h-8.733V538h-2.7v2.912h2.7v5.821h2.912v-2.911h8.587v2.911h5.821v-2.765h2.912v2.765h2.911v-2.765h2.911v-2.911h-2.911v2.766h-2.911v-5.676h5.821v2.911H560.8v2.911h2.911v2.912h-1.747v2.911h22.124V546.88H581.18v-5.823h-2.911v-2.911h2.911v2.911h2.912v-5.821Zm-43.518,2.911v2.766h-2.911V538h2.911Zm11.5,5.676h-2.911v-2.766h2.911ZM560.8,529.414v-5.821h8.732v8.732H560.8Zm17.465,17.467h-2.911v-2.912h-2.911v2.912h-5.823v-5.823h-2.911v-2.911H560.8v-2.911h5.821v5.821h2.911v2.911h2.912v-2.911h2.911v2.911h2.911Z"
        transform="translate(-502.438 -471.194)"
        fill="#1f2124"
      />
    </G>
  </Svg>
);
export default QR_code;
