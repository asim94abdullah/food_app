import * as React from "react";
import Svg, { Ellipse, Path } from "react-native-svg";

const EditIcon = (props) => (
    <Svg
        xmlns="http://www.w3.org/2000/svg"
        width={52.673}
        height={52.673}
        viewBox="0 0 52.673 52.673"
        {...props}
    >
        <Ellipse
            id="Ellipse_53"
            data-name="Ellipse 53"
            cx={26.337}
            cy={26.336}
            rx={26.337}
            ry={26.336}
            fill={props.active ? "#014365" : "#DCDCDC"}
        />
        <Ellipse
            id="Ellipse_54"
            data-name="Ellipse 54"
            cx={24.364}
            cy={24.364}
            rx={24.364}
            ry={24.364}
            transform="translate(2 2)"
            fill="#fff"
        />
        <Path
            id="Icon_material-mode-edit"
            data-name="Icon material-mode-edit"
            d="M4.5,19.834v4.035H8.535l11.9-11.9L16.4,7.932ZM23.558,8.846a1.072,1.072,0,0,0,0-1.517L21.04,4.811a1.072,1.072,0,0,0-1.517,0L17.553,6.78l4.035,4.035,1.969-1.969Z"
            transform="translate(11.5 12.504)"
            fill={props.active ? "#56ad4c" : "#DCDCDC"}
        />
    </Svg>
);

export default EditIcon;
