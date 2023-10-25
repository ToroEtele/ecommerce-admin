import { type ClassValue, clsx } from "clsx";
import { NextResponse } from "next/server";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "RON",
});

export const verifyCheckoutData = (checkoutData: any) => {
  const {
    name,
    email,
    phone,
    address,
    city,
    state,
    zip,
    isCompany,
    cmp_name,
    cmp_city,
    cmp_cui,
    cmp_address,
    cmp_state,
    cmp_bank,
    cmp_cont,
  } = checkoutData;

  if (!name) return new NextResponse("Name is required", { status: 400 });
  if (!email) return new NextResponse("Email is required", { status: 400 });
  if (!phone) return new NextResponse("Phone is required", { status: 400 });
  if (!address) return new NextResponse("Address is required", { status: 400 });
  if (!city) return new NextResponse("City is required", { status: 400 });
  if (!state) return new NextResponse("State is required", { status: 400 });
  if (!zip) return new NextResponse("Zip is required", { status: 400 });
  if (isCompany) {
    if (!cmp_name)
      return new NextResponse("Company name is required", { status: 400 });
    if (!cmp_city)
      return new NextResponse("Company city is required", { status: 400 });
    if (!cmp_cui)
      return new NextResponse("Company cui is required", { status: 400 });
    if (!cmp_address)
      return new NextResponse("Company address is required", { status: 400 });
    if (!cmp_state)
      return new NextResponse("Company state is required", { status: 400 });
    if (!cmp_bank)
      return new NextResponse("Company bank is required", { status: 400 });
    if (!cmp_cont)
      return new NextResponse("Company contact is required", { status: 400 });
  }
};
