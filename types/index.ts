import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type ModalWindowProps = {
  isOpen: boolean;
  onOpenChangeHandler: () => void;
};

export type User = {
  id: string;
  username: string;
  email: string;
} | null;
