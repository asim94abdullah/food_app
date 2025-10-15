import * as React from "react";
import Svg, { Defs, Image, G, Line, Path, Use, Circle } from "react-native-svg";
const ActiveTrasit = (props) => (
    <Svg
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        width={107.066}
        height={85.725}
        viewBox="0 0 107.066 85.725"
        {...props}
    >
        <Defs>
            <Image
                id="image"
                width={20.995}
                height={2.47}
                xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFUAAAAKCAYAAADFLRJ4AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAR1SURBVEhLtZbLSiVJEIbrdq7qcUZ7RHAzjKAbVzLzIAO97ifwaQQfwFn6Aq58BVF3gigieD3e0XOrOjX/F2bWVFe3IAMm/ERkZGRkxp+RWRXmeR58UqsLicAC4zL29/e/hGEYCHlJmq4W93q9MI7j3GE8HA7jKIryJEnGtVptjByNRjGS8SzLNBzlHsSp1+syZxYHG37ozAEsJPkpyX+YVPl17u7ukuvr63qn0xns7u7ONhqNrNvttrW5YGlp6UZubPZ3JQU7z8KtIyrY3t7+Q3q+uLh44ZI0lHUB8owo1L29vd/QV1dXu5CkPXiSxmqR1s0gF6KFbDAYQHR+dHT0C8StrKx06RNDfpGLa2sxjjw7O5tCJwaH0G63U/zY89TU1JD5/nAskQ+0n5H6583NTfb4+BioourHx8dNyDw/PxeHDTYUKKl4fn4ewphMZXQENoL+KgQHBwdfIGx2drbPJtkU0idT6pv0fRHyKz4zMzM9JeqrE1noT09PJiHC25yeN5vNMfvCXlrD9DRNOQh0s+GvXFtubrawsPDC4dHHhzmKl5KHQN75/f19A3ur1UrxM8YqrSBV8uvJyclgY2Ojsby8/LS5uemvaCBiemwUXa3t7Ews2/Orq6s2i7G4qnnoNpPrOidINuNt1b4OrjkxMTHC5lCQUrb5+PSZ4+06hL4jqgwjlz3ih458fn6uQ4iQYePgkY5c/MR/6g/RYnmp9SE68+Qr71C3AMIDYkMEpH4zRvI8Ozw8DNfW1gItCksFWUine4mN9hZEslQFhY3kJe2E6Zd1NuF9dJXtejGfPqBf0W2sbCcefcHIQPr+e3bmsE4Jti4kAfwq4wbskEjlonO4xMPGM4hkT+QeCf/oquZbW1vR+vp6IHKwQ7JBDRYh30uz+XEHSLGrIIIQ3zU3p9zeTkiNMTYJwcRx5iJ2Sbc9cABet0HXnE/Z1yT7YY6H8y1i+XGKgjeZjyJAd0g0zgc3FiL5xfjLJ1GFAvPp9/sx7zbxbXHa5eXl33q0U72d6c7OTkMfpPDl5YUKTDhdmpPGuvREp2bV4vqIkYLj/11VvqNbpU5OTo782Ovraw0dkpEelT4VEfBUeJ3k8RGqlVropWfD+mzWX2kvPfDz1Ym/dKrUqtj7UrFI8lAOPHWWF3ELUn1T/y99pLLT09NQj3J2cXFR19vFb06gRz3QCTXl9sbkf/N93yodgtCpBnQWZHNsgIWdrSC4ZLO51V8kwNWs2jxI1unE++GZ8MmzB+xVwgS+8vZ88TF2MQDERRAqmWoslC0jN74ZyJ+1H0h9rynR6YeHhxhQ6iK8xq+V/g46GoZUrgCuRpZQoyNpi/NRgTA3ZuRVpfMP5ubm+IPIb29vIakteNIN6Pq45Dr8wib0kdPT08XB6abVPZFUNrG57lSbi1ccKn4QxRVmnMrmVwqiBfNhfx9pHyb1/zTFbknwzkA6MF0fRHt7fOONIkmSRsHkdCObhHjzPBnM8eNqRg52wHOiZ4S/jWIuYC5jTPjcFgT/AugXdbDDgJlHAAAAAElFTkSuQmCC"
            />
            <Image
                id="image-2"
                width={12.103}
                height={3.458}
                xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADEAAAAOCAYAAACGsPRkAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAPsSURBVEhLtZVLa1RLEMfrPObMTDIZ4/UBGoMLCULIMgiKCz+NX8AP5M6VG924cCsoKrpVlAiaYHDk+ghzksl52b+q1Jy518QbLlpQ9Onu6q7/vx59oqZp5I/Izk4iWdbI7m4svV6tWhSRdDq/3eHxSeztxRLHTVCRJ0+GEkUiX7+mCmx9fUcuXJhIWUYyGnXUBtvHj4cKGjLXrtXy7FkUvmu9L00bmZurpK6jMNbBrpbFxVJtu12zOaYcTaIo+vLqVRYiKvL06YICRV68GAQnjUb25cuBXL6cK6BZTZJG3ryZk5WVXBYWKplMYun3a6kq0bN1wAjQra2urK7a+X6/0jvZZ+/jx0zvOXmy1LPsHSE/k3j+fEnyvJS3bzty796inDlTyNraWDY2epqNJJFAbk6dXrq0pxH8/LkzjSDj1lYmw6GDMgDoqVOFAh6NMj0POJQMug326MWLEx0hQWlaRs2GMzPSkvjwYVVu307l+vW/5ebNJS0PSgaJoka/x+M0EIwUCJceNn761FHHDsYjCwC+9/cNsO9RQvPzlZ5n/du3RJaXJ1piEN3dTaaEWTt/fqLlinBHECOxsXFVbt2K5cGDRC8CDKkkQhzgezxOQmmUmgnmqNv5GjYnTpQBUBVAiwJDIcCY57FmCOf4+bdSdufO7Sto5mQe4MvLe+rDCbOGn6qK8Bs1eX5DtrcncuVKJl++EHWLPAaAZE6TNo0emAJvRyPAGcSBp6kBN7VvAkJEZzPUKvv0BhE3oD4CHFK+hg2lyXooXxpOQu13QxoVgzYdBADvpcY3oB04YIwsu2bEGvuMgLHsmMaxZZR97uRFcj9km5F1I9/eT+DYIyN5noRMRfoacvb790TXglg53b17Ve7cieXhw3A6gCK63gc4JJIOjrlngibm2xWn2LLnSgQZAYiNPwBEnjLzXmHNGrfNEGfddjgstZwGA6JvmT3IkJEYjdZDP1RBG3n9OtXXQCkeELHItFGGiAN0Asy9N7wUIYRTJ8GIQsQItCO2Ntq9ToBHgjOUEXMwnD1L30yD075OZbkSGryWzc1K7t/vhVemCSnLpmlHnURbLg7e1UrG1w9TJ4MNoOkd5tS7ZwXArNHkPAb+2uGf6DPS2AfSkpiV9+//CmTicGkV/rrzgYCE5s+0Nt0eUmTJATnwo8jM7jNCZjYTrFnp1PqCuS0BO326UF/8OPHL+owcTuKfQmnV8ujRUGdchrx719MmswxZqXEXDjxLsxmzuX1DgBGg/Ej5czNfWpqEFzLVbAwGvErTaP9KjkPiv2Vzs6tpp/4hCTlenaKgFIpQlqk2Jf8RszGn2FIqrFMm/0tEfgAKB4ExMXZQfAAAAABJRU5ErkJggg=="
            />
        </Defs>
        <G
            id="Group_1049"
            data-name="Group 1049"
            transform="translate(-40.209 -328.127)"
        >
            <Line
                id="Line_6"
                data-name="Line 6"
                y1={29.908}
                x2={42.157}
                transform="translate(58.163 361.293)"
                fill="none"
                stroke="#014365"
                strokeWidth={4}
            />
            <G
                id="Group_1048"
                data-name="Group 1048"
                transform="translate(95.899 332.766)"
            >
                <Path
                    id="radio_on"
                    d="M10.785,2a8.785,8.785,0,1,0,8.785,8.785A8.811,8.811,0,0,0,10.785,2Zm0,15.813a7.028,7.028,0,1,1,7.028-7.028,7.049,7.049,0,0,1-7.028,7.028Z"
                    transform="translate(-0.279 12.394)"
                    fill="#ffc001"
                    stroke="#ffc001"
                    strokeWidth={2}
                    fillRule="evenodd"
                />
                <G
                    id="Group_1043"
                    data-name="Group 1043"
                    transform="translate(-0.69 -4.64)"
                    style={{
                        isolation: "isolate",
                    }}
                >
                    <Use
                        id="Rectangle_14"
                        data-name="Rectangle 14"
                        transform="translate(11.071 28.502)"
                        opacity={0.37}
                        xlinkHref="#image"
                        style={{
                            mixBlendMode: "multiply",
                            isolation: "isolate",
                        }}
                    />
                    <Use
                        id="Rectangle_15"
                        data-name="Rectangle 15"
                        transform="translate(11.071 28.008)"
                        opacity={0.25}
                        xlinkHref="#image-2"
                        style={{
                            mixBlendMode: "multiply",
                            isolation: "isolate",
                        }}
                    />
                    <G id="Group_907" data-name="Group 907">
                        <G id="Group_906" data-name="Group 906">
                            <Path
                                id="Path_788"
                                data-name="Path 788"
                                d="M608.745,387.152c-6.4,0-11.582,5.581-11.582,12.465,0,8.365,10.135,17.276,11.582,17.276,2.432,0,11.582-10.393,11.582-17.276S615.143,387.152,608.745,387.152Zm0,17.734A6.881,6.881,0,1,1,615.627,398,6.88,6.88,0,0,1,608.745,404.886Z"
                                transform="translate(-597.163 -387.152)"
                                fill="#57ad4d"
                            />
                            <Circle
                                id="Ellipse_50"
                                data-name="Ellipse 50"
                                cx={2.569}
                                cy={2.569}
                                r={2.569}
                                transform="translate(9.013 8.283)"
                                fill="#57ad4d"
                            />
                        </G>
                    </G>
                </G>
            </G>
            <Line
                id="Line_7"
                data-name="Line 7"
                x2={61.157}
                y2={9.196}
                transform="translate(58.163 397.097)"
                fill="none"
                stroke="#014365"
                strokeWidth={4}
            />
            <G
                id="Group_1069"
                data-name="Group 1069"
                transform="translate(40.899 369.371)"
            >
                <Path
                    id="radio_on-2"
                    data-name="radio_on"
                    d="M10.785,2a8.785,8.785,0,1,0,8.785,8.785A8.811,8.811,0,0,0,10.785,2Zm0,15.813a7.028,7.028,0,1,1,7.028-7.028,7.049,7.049,0,0,1-7.028,7.028Z"
                    transform="translate(-0.279 12.394)"
                    fill="#ffc001"
                    stroke="#ffc001"
                    strokeWidth={2}
                    fillRule="evenodd"
                />
                <G
                    id="Group_1043-2"
                    data-name="Group 1043"
                    transform="translate(-0.69 -4.64)"
                    style={{
                        isolation: "isolate",
                    }}
                >
                    <Use
                        id="Rectangle_14-2"
                        data-name="Rectangle 14"
                        transform="translate(11.071 28.502)"
                        opacity={0.37}
                        xlinkHref="#image"
                        style={{
                            mixBlendMode: "multiply",
                            isolation: "isolate",
                        }}
                    />
                    <Use
                        id="Rectangle_15-2"
                        data-name="Rectangle 15"
                        transform="translate(11.071 28.008)"
                        opacity={0.25}
                        xlinkHref="#image-2"
                        style={{
                            mixBlendMode: "multiply",
                            isolation: "isolate",
                        }}
                    />
                    <G id="Group_907-2" data-name="Group 907">
                        <G id="Group_906-2" data-name="Group 906">
                            <Path
                                id="Path_788-2"
                                data-name="Path 788"
                                d="M608.745,387.152c-6.4,0-11.582,5.581-11.582,12.465,0,8.365,10.135,17.276,11.582,17.276,2.432,0,11.582-10.393,11.582-17.276S615.143,387.152,608.745,387.152Zm0,17.734A6.881,6.881,0,1,1,615.627,398,6.88,6.88,0,0,1,608.745,404.886Z"
                                transform="translate(-597.163 -387.152)"
                                fill="#57ad4d"
                            />
                            <Circle
                                id="Ellipse_50-2"
                                data-name="Ellipse 50"
                                cx={2.569}
                                cy={2.569}
                                r={2.569}
                                transform="translate(9.013 8.283)"
                                fill="#57ad4d"
                            />
                        </G>
                    </G>
                </G>
            </G>
            <G
                id="Group_1070"
                data-name="Group 1070"
                transform="translate(115.899 380.887)"
            >
                <Path
                    id="radio_on-3"
                    data-name="radio_on"
                    d="M10.785,2a8.785,8.785,0,1,0,8.785,8.785A8.811,8.811,0,0,0,10.785,2Zm0,15.813a7.028,7.028,0,1,1,7.028-7.028,7.049,7.049,0,0,1-7.028,7.028Z"
                    transform="translate(-0.279 12.394)"
                    fill="#ffc001"
                    stroke="#ffc001"
                    strokeWidth={2}
                    fillRule="evenodd"
                />
                <G
                    id="Group_1043-3"
                    data-name="Group 1043"
                    transform="translate(-0.69 -4.64)"
                    style={{
                        isolation: "isolate",
                    }}
                >
                    <Use
                        id="Rectangle_14-3"
                        data-name="Rectangle 14"
                        transform="translate(11.071 28.502)"
                        opacity={0.37}
                        xlinkHref="#image"
                        style={{
                            mixBlendMode: "multiply",
                            isolation: "isolate",
                        }}
                    />
                    <Use
                        id="Rectangle_15-3"
                        data-name="Rectangle 15"
                        transform="translate(11.071 28.008)"
                        opacity={0.25}
                        xlinkHref="#image-2"
                        style={{
                            mixBlendMode: "multiply",
                            isolation: "isolate",
                        }}
                    />
                    <G id="Group_907-3" data-name="Group 907">
                        <G id="Group_906-3" data-name="Group 906">
                            <Path
                                id="Path_788-3"
                                data-name="Path 788"
                                d="M608.745,387.152c-6.4,0-11.582,5.581-11.582,12.465,0,8.365,10.135,17.276,11.582,17.276,2.432,0,11.582-10.393,11.582-17.276S615.143,387.152,608.745,387.152Zm0,17.734A6.881,6.881,0,1,1,615.627,398,6.88,6.88,0,0,1,608.745,404.886Z"
                                transform="translate(-597.163 -387.152)"
                                fill="#57ad4d"
                            />
                            <Circle
                                id="Ellipse_50-3"
                                data-name="Ellipse 50"
                                cx={2.569}
                                cy={2.569}
                                r={2.569}
                                transform="translate(9.013 8.283)"
                                fill="#57ad4d"
                            />
                        </G>
                    </G>
                </G>
            </G>
        </G>
    </Svg>
);
export default ActiveTrasit;
