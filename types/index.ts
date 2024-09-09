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

export type ErrorDetail = { error: string };

export type StatusDetail = { message: string };

export type ResultResponse<T> = {
  data: T;
  status: number;
  isError: boolean;
};

export type dbError = { message: string; status: number };
