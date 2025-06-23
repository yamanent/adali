import type { Metadata } from "next";
import "./print.css";

export const metadata: Metadata = {
  title: "Rezervasyon Takvimi - Adalı Pansiyon",
  description: "Adalı Pansiyon rezervasyon takvimi",
};

export default function ReservationCalendarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
    </>
  );
}
