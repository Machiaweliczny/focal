import React, { useEffect, useState } from "react";
import login from "../../api/login";
import { ErrorToast } from "../../ui/Toast/Toast";
import { isEmailValid } from "../../util";
import "./LoginPage.css";
// Login Page

// Implement login page with two step authentication and error handling.
// Login form with email and password fields and submit button
// User should be able to submit the form using "Sign in" button or by hitting Enter key on the keyboard
// Form submission should be available only when the form is filled and the user provides valid email (valid in terms of format, not existing user account)
// Validation errors should be shown on the screen
// Login failure should be presented to the user as a snackbar/notification
// After successful email / password authentication the user should provide OTP/TOTP code for two-factor authentication if backend decides
// After successful two-step authentication the user should be logged in and redirected to home page
// The user should remain logged in when the app is reloaded

// Backend should contain login endpoint that will return acknowledge that user provided correct credentials. There should be two users hardcoded into backend, and one of them should have OTP enabled. Implementation for OTP is not necessary, and can accept 111111 all the time.

// Technology stack
// TypeScript with React/Redux
// Python with Flask (sync) or FastAPI (async)

function i18n(text: string) {
  if (text == "invalidCredentials") {
    return "Provided credentials aren't correct";
  }
  if (text == "otpInvalid") {
    return "One time password wasn't correct";
  }

  return text;
}

export default function LoginPage() {
  const [formState, setFormState] = useState({
    email: "",
    password: "",
    otp: "",
  });
  const [error, setError] = useState("");
  const [showOTPInput, setOTPDisplay] = useState(false);

  function handleFormInput(name: keyof typeof formState) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormState((s) => ({ ...s, [name]: e.target.value }));
    };
  }

  function isFormValid(form: typeof formState) {
    return isEmailValid(form.email);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    login(formState).then((body) => {
      if (body.error) {
        if (body.error === "otpRequired") {
          setOTPDisplay(true);
        } else {
          setError(i18n(body.error));
        }
      } else {
        // NOTE: can be handled better
        console.log("redirecting");
        window.location.href = "/";
      }
    });
  }

  return (
    <div className="formContainer">
      <h1>Login: </h1>
      <form onSubmit={handleSubmit} method="POST" action="/login">
        <div>
          <label>
            Email:{" "}
            <input
              autoFocus
              style={{
                border: isEmailValid(formState.email) ? "" : "1px solid red",
              }}
              type="text"
              name="email"
              tabIndex={1}
              value={formState.email}
              onChange={handleFormInput("email")}
              placeholder="email"
            />
          </label>
        </div>
        <div>
          <label>
            Password:{" "}
            <input
              type="password"
              name="password"
              tabIndex={2}
              value={formState.password}
              onChange={handleFormInput("password")}
            />
          </label>
        </div>
        {showOTPInput && (
          <div>
            <label>
              OTP:{" "}
              <input
                type="text"
                name="otp"
                tabIndex={3}
                value={formState.otp}
                onChange={handleFormInput("otp")}
              />
            </label>
          </div>
        )}
        <button tabIndex={4} disabled={!isFormValid(formState)}>
          {" "}
          Login{" "}
        </button>
      </form>
      {error ? <ErrorToast message={error} /> : null}
    </div>
  );
}
