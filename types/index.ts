import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface ModalWindowProps {
  isOpen: boolean;
  onOpenChangeHandler: () => void;
}
