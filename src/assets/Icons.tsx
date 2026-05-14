import React from "react";
import Svg, { Path } from "react-native-svg";

type IconProps = {
  width?: number;
  height?: number;
  active?: boolean;
};

export const HomeIcon = ({
  width = 28,
  height = 28,
  active = false,
}: IconProps) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 28 28" fill="none">
      <Path d="M2.33325 14.2379C2.33325 11.5674 2.33325 10.2328 2.93992 9.12675C3.54425 8.01959 4.65142 7.33359 6.86459 5.95925L9.19792 4.51142C11.5371 3.05892 12.7073 2.33325 13.9999 2.33325C15.2926 2.33325 16.4616 3.05892 18.8019 4.51142L21.1353 5.95925C23.3484 7.33359 24.4556 8.01959 25.0611 9.12675C25.6666 10.2339 25.6666 11.5674 25.6666 14.2368V16.0124C25.6666 20.5624 25.6666 22.8386 24.2993 24.2526C22.9319 25.6666 20.7328 25.6666 16.3333 25.6666H11.6666C7.26709 25.6666 5.06675 25.6666 3.70059 24.2526C2.33442 22.8386 2.33325 20.5636 2.33325 16.0124V14.2379Z"
        fill={active ? "#07C187" : "none"}
        stroke={active ? "#07C187" : "#72828A"}
        strokeWidth={active ? 2 : 1.5} />
      <Path d="M14 17.5V21" stroke={active ? "#FFFFFF" : "#72828A"} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
};

export const MyCartIcon = ({
  width = 28,
  height = 28,
  active = false,
}: IconProps) => {
  const strokeColor = active ? "#07C187" : "#72828A";
  const fillColor = active ? "#07C187" : "none";

  return (
    <Svg width={width} height={height} viewBox="0 0 28 28" fill="none">
      <Path d="M4.50792 19.1975C3.50692 15.1935 3.00642 13.1927 4.05758 11.8463C5.10875 10.5 7.17258 10.5 11.2991 10.5H16.7007C20.8284 10.5 22.8911 10.5 23.9422 11.8463C24.9934 13.1927 24.4929 15.1947 23.4919 19.1975C22.8549 21.7443 22.5376 23.0172 21.5879 23.7592C20.6382 24.5 19.3257 24.5 16.7007 24.5H11.2991C8.67408 24.5 7.36158 24.5 6.41192 23.7592C5.46225 23.0172 5.14375 21.7443 4.50792 19.1975Z" stroke={strokeColor} fill={fillColor}/>
      <Path d="M22.75 11.0837L21.9217 8.04449C21.602 6.87199 21.4422 6.28633 21.1143 5.84416C20.7875 5.40487 20.3435 5.06646 19.8333 4.86766C19.32 4.66699 18.7133 4.66699 17.5 4.66699" stroke={strokeColor}/>
      <Path d="M5.25 11.0837L6.07833 8.04449C6.398 6.87199 6.55783 6.28633 6.88567 5.84416C7.21254 5.40487 7.65647 5.06646 8.16667 4.86766C8.68 4.66699 9.28667 4.66699 10.5 4.66699" stroke={strokeColor} />
      <Path d="M10.5 4.66667C10.5 4.35725 10.6229 4.0605 10.8417 3.84171C11.0605 3.62292 11.3572 3.5 11.6667 3.5H16.3333C16.6428 3.5 16.9395 3.62292 17.1583 3.84171C17.3771 4.0605 17.5 4.35725 17.5 4.66667C17.5 4.97609 17.3771 5.27283 17.1583 5.49162C16.9395 5.71042 16.6428 5.83333 16.3333 5.83333H11.6667C11.3572 5.83333 11.0605 5.71042 10.8417 5.49162C10.6229 5.27283 10.5 4.97609 10.5 4.66667Z" stroke={strokeColor}/>
    </Svg>
  );
};

export const OrderHistoryIcon = ({
  width = 28,
  height = 28,
  active = false,
}: IconProps) => {
  const strokeColor = active ? "#07C187" : "#72828A";
  const fillColor = active ? "#07C187" : "none";
  const innerColor = active ? "#FFFFFF" : "#72828A";

  return (
    <Svg width={width} height={height} viewBox="0 0 28 28" fill="none">
      <Path d="M3.5 11.6663C3.5 7.26684 3.5 5.06651 4.86733 3.70034C6.23467 2.33417 8.43383 2.33301 12.8333 2.33301H15.1667C19.5662 2.33301 21.7665 2.33301 23.1327 3.70034C24.4988 5.06767 24.5 7.26684 24.5 11.6663V16.333C24.5 20.7325 24.5 22.9328 23.1327 24.299C21.7653 25.6652 19.5662 25.6663 15.1667 25.6663H12.8333C8.43383 25.6663 6.2335 25.6663 4.86733 24.299C3.50117 22.9317 3.5 20.7325 3.5 16.333V11.6663Z" fill={fillColor} stroke={strokeColor}/>
      <Path d="M9.33325 11.666H18.6666" stroke={innerColor} strokeLinecap="round" />
      <Path d="M9.33325 16.3327H15.1666" stroke={innerColor} strokeLinecap="round" />
    </Svg>
  );
};

export const ProfileIcon = ({
  width = 28,
  height = 28,
  active = false,
}: IconProps) => {
  const strokeColor = active ? "#07C187" : "#72828A";
  const fillColor = active ? "#07C187" : "none";

  return (
    <Svg width={width} height={height} viewBox="0 0 28 28" fill="none">
      <Path d="M14.0002 11.6663C16.5775 11.6663 18.6668 9.577 18.6668 6.99967C18.6668 4.42235 16.5775 2.33301 14.0002 2.33301C11.4228 2.33301 9.3335 4.42235 9.3335 6.99967C9.3335 9.577 11.4228 11.6663 14.0002 11.6663Z" fill={fillColor} stroke={strokeColor} />
      <Path d="M23.3334 20.416C23.3334 23.3152 23.3334 25.666 14.0001 25.666C4.66675 25.666 4.66675 23.3152 4.66675 20.416C4.66675 17.5168 8.84575 15.166 14.0001 15.166C19.1544 15.166 23.3334 17.5168 23.3334 20.416Z" fill={fillColor} stroke={strokeColor} />
    </Svg>
  );
};