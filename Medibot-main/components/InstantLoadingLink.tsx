"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLoading } from "./LoadingContext";
import React from "react";

interface InstantLoadingLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  prefetch?: boolean;
  replace?: boolean;
  scroll?: boolean;
}

const InstantLoadingLink: React.FC<InstantLoadingLinkProps> = ({
  href,
  children,
  className,
  prefetch,
  replace,
  scroll,
}) => {
  const router = useRouter();
  const { setLoading } = useLoading();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setLoading(true);
    router.push(href);
  };

  return (
    <Link
      href={href}
      className={className}
      prefetch={prefetch}
      replace={replace}
      scroll={scroll}
      onClick={handleClick}
    >
      {children}
    </Link>
  );
};

export default InstantLoadingLink;
