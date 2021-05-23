export default function login(body: { email: string; password: string }) {
  return window
    .fetch("/login", {
      method: "POST",
      // @ts-ignore
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((res) => res.json())
    .then((body) => {
      return {
        error: body.error as
          | undefined
          | "otpRequired"
          | "otpInvalid"
          | "invalidCredentials",
      };
    });
}
