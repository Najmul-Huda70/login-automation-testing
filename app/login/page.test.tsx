import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginPage from "./page";

const pushMock = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}));

const signInEmailMock = vi.fn();
vi.mock("@/lib/auth-client", () => ({
  authClient: {
    signIn: {
      email: (...args: unknown[]) => signInEmailMock(...args),
    },
  },
}));

const DEMO_EMAIL = "contact.najmulhuda@gmail.com";
const DEMO_PASSWORD = "secrete_password";

async function fillAndSubmit(email: string, password: string) {
  const user = userEvent.setup();
  if (email) await user.type(screen.getByLabelText("Email"), email);
  if (password) await user.type(screen.getByLabelText("Password"), password);
  await user.click(screen.getByRole("button", { name: /^sign in$/i }));
  return user;
}

beforeEach(() => {
  pushMock.mockReset();
  signInEmailMock.mockReset();
});

describe("LoginPage — manual form (T-1 to T-6)", () => {
  it("T-3: shows both errors and does not call the auth API when both fields are blank", async () => {
    render(<LoginPage />);
    await fillAndSubmit("", "");

    expect(await screen.findByText("Email is required.")).toBeInTheDocument();
    expect(await screen.findByText("Password is required.")).toBeInTheDocument();
    expect(signInEmailMock).not.toHaveBeenCalled();
  });

  it("T-1: shows an email-required error and does not call the auth API when email is blank", async () => {
    render(<LoginPage />);
    await fillAndSubmit("", DEMO_PASSWORD);

    expect(await screen.findByText("Email is required.")).toBeInTheDocument();
    expect(signInEmailMock).not.toHaveBeenCalled();
  });

  it("T-2: shows a password-required error and does not call the auth API when password is blank", async () => {
    render(<LoginPage />);
    await fillAndSubmit(DEMO_EMAIL, "");

    expect(await screen.findByText("Password is required.")).toBeInTheDocument();
    expect(signInEmailMock).not.toHaveBeenCalled();
  });

  it("T-4: shows a format error for a malformed email and does not call the auth API", async () => {
    render(<LoginPage />);
    await fillAndSubmit("not-an-email", DEMO_PASSWORD);

    expect(await screen.findByText("Enter a valid email address.")).toBeInTheDocument();
    expect(signInEmailMock).not.toHaveBeenCalled();
  });

  it("T-5: calls the auth API and shows an error for correct email + wrong password, without redirecting", async () => {
    signInEmailMock.mockResolvedValue({ error: { message: "Invalid email or password." } });
    render(<LoginPage />);
    await fillAndSubmit(DEMO_EMAIL, "wrong_password");

    expect(signInEmailMock).toHaveBeenCalledWith({
      email: DEMO_EMAIL,
      password: "wrong_password",
    });
    expect(await screen.findByText("Invalid email or password.")).toBeInTheDocument();
    expect(pushMock).not.toHaveBeenCalled();
  });

  it("T-6: calls the auth API and redirects to /dashboard for correct credentials", async () => {
    signInEmailMock.mockResolvedValue({ error: null });
    render(<LoginPage />);
    await fillAndSubmit(DEMO_EMAIL, DEMO_PASSWORD);

    expect(signInEmailMock).toHaveBeenCalledWith({
      email: DEMO_EMAIL,
      password: DEMO_PASSWORD,
    });
    await waitFor(() => expect(pushMock).toHaveBeenCalledWith("/dashboard"));
  });
});

describe("LoginPage — password visibility toggle (FR-13, FR-14)", () => {
  it("toggles the input type without submitting the form", async () => {
    render(<LoginPage />);
    const user = userEvent.setup();
    const passwordInput = screen.getByLabelText("Password") as HTMLInputElement;
    expect(passwordInput.type).toBe("password");

    await user.click(screen.getByRole("button", { name: /show password/i }));
    expect(passwordInput.type).toBe("text");
    expect(signInEmailMock).not.toHaveBeenCalled();
    expect(pushMock).not.toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: /hide password/i }));
    expect(passwordInput.type).toBe("password");
  });
});

describe("LoginPage — links", () => {
  it("shows a public testing-guide link and the portfolio link", () => {
    render(<LoginPage />);
    expect(screen.getByRole("link", { name: /how to run login tests locally/i })).toHaveAttribute(
      "href",
      "/testing-guide"
    );
    const portfolioLink = screen.getByRole("link", { name: /view portfolio/i });
    expect(portfolioLink).toHaveAttribute("href", "https://najmul-huda-portfolio.vercel.app/");
    expect(portfolioLink).toHaveAttribute("target", "_blank");
    expect(portfolioLink).toHaveAttribute("rel", "noopener noreferrer");
  });
});
