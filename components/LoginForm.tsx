"use client";

import { useState, useEffect, useRef } from "react";
import { authenticate } from "@/app/lib/actions";

export default function LoginForm({
  defaultEmail = null,
  defaultPassword = null,
}: {
  defaultEmail?: string | null;
  defaultPassword?: string | null;
}) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  useEffect(() => {
    if (defaultEmail && defaultPassword) {
      emailRef.current.value = defaultEmail;
      passwordRef.current.value = defaultPassword;
    }
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsPending(true);
    setErrorMessage(null);

    const formData = new FormData();
    formData.append("email", emailRef.current.value);
    formData.append("password", passwordRef.current.value);
    try {
      await authenticate(null, formData);
    } catch (error) {
      setErrorMessage("Invalid credentials.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="card bg-base-100 w-full h- max-w-sm shrink-0 shadow-2xl mr-4 opacity-90">
      <form className="card-body" onSubmit={handleSubmit}>
        <div className="form-control ">
          <label className="label">
            <span className="label-text">Email</span>
          </label>
          <input
            type="email"
            placeholder="email"
            className="input input-bordered text-base-content"
            required
            ref={emailRef}
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Password</span>
          </label>
          <input
            type="password"
            placeholder="password"
            className="input input-bordered text-base-content"
            required
            ref={passwordRef}
          />
          <label className="label">
            <a href="#" className="label-text-alt link link-hover">
              Forgot password?
            </a>
          </label>
        </div>
        <div className="form-control mt-6">
          <button className="btn btn-primary" aria-disabled={isPending}>
            Login
          </button>
        </div>
        <div
          className="flex h-8 items-end space-x-1"
          aria-live="polite"
          aria-atomic="true"
        >
          {errorMessage && (
            <p className="text-center text-sm text-red-500">{errorMessage}</p>
          )}
          
        </div>
      </form>
    </div>
  );
}
