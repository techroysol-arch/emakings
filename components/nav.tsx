"use client";
import { useState } from "react";
import Link from "next/link";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { Brand } from "./brand";
export function Nav() {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <div className="container nav">
        <Brand />
        <nav
          className={open ? "nav-links open" : "nav-links"}
          aria-label="Main navigation"
        >
          {[
            ["Home", "/"],
            ["Features", "/#features"],
            ["How it works", "/#how-it-works"],
            ["Technology", "/#technology"],
            ["About", "/#about"],
          ].map(([label, href]) => (
            <Link onClick={() => setOpen(false)} key={label} href={href}>
              {label}
            </Link>
          ))}
        </nav>
        <div className="nav-actions">
          <Link href="/login" className="sign-in">
            Sign in
          </Link>
          <Link href="/signup" className="button small">
            Get started <ArrowUpRight size={14} />
          </Link>
        </div>
        <button
          className="menu-button icon-button"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
    </header>
  );
}
