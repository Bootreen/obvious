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

export type SessionDetail = {
  id: number;
  user_id?: string;
  created_at?: string;
};

export type RequestDetail = {
  id: number;
  request_data: RequestData;
  created_at: string;
};

export type RequestData = Record<string, any>;

export type ResultResponse = {
  data: Record<string, any>;
  status: number;
  isError: boolean;
};

export type dbError = { message: string; status: number };

export type HistorySession = {
  session: SessionDetail;
  requests: RequestDetail[];
};

export type UserHistory = HistorySession[];
