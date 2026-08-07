import { describe, it, expect } from "vitest";
import {
  validateEmail,
  validatePassword,
  validateLoginForm,
  isLoginFormValid,
} from "./validation";

describe("validateEmail", () => {
  it("requires an email", () => {
    expect(validateEmail("")).toBe("Email is required.");
  });

  it("treats whitespace-only input as blank", () => {
    expect(validateEmail("   ")).toBe("Email is required.");
  });

  it("rejects a malformed email", () => {
    expect(validateEmail("not-an-email")).toBe("Enter a valid email address.");
  });

  it("accepts a valid email", () => {
    expect(validateEmail("contact.najmulhuda@gmail.com")).toBeUndefined();
  });
});

describe("validatePassword", () => {
  it("requires a password", () => {
    expect(validatePassword("")).toBe("Password is required.");
  });

  it("accepts a non-empty password", () => {
    expect(validatePassword("secrete_password")).toBeUndefined();
  });
});

describe("validateLoginForm", () => {
  it("returns both errors when both fields are blank (T-3)", () => {
    const errors = validateLoginForm({ email: "", password: "" });
    expect(errors.email).toBe("Email is required.");
    expect(errors.password).toBe("Password is required.");
  });

  it("returns only the email error when password is filled (T-1)", () => {
    const errors = validateLoginForm({ email: "", password: "secrete_password" });
    expect(errors.email).toBe("Email is required.");
    expect(errors.password).toBeUndefined();
  });

  it("returns only the password error when email is filled (T-2)", () => {
    const errors = validateLoginForm({
      email: "contact.najmulhuda@gmail.com",
      password: "",
    });
    expect(errors.password).toBe("Password is required.");
    expect(errors.email).toBeUndefined();
  });

  it("flags a malformed email (T-4)", () => {
    const errors = validateLoginForm({ email: "not-an-email", password: "secrete_password" });
    expect(errors.email).toBe("Enter a valid email address.");
  });

  it("returns no errors for a fully valid form (T-5/T-6 shape)", () => {
    const errors = validateLoginForm({
      email: "contact.najmulhuda@gmail.com",
      password: "secrete_password",
    });
    expect(errors).toEqual({});
  });
});

describe("isLoginFormValid", () => {
  it("is false when any field is invalid", () => {
    expect(isLoginFormValid({ email: "", password: "secrete_password" })).toBe(false);
  });

  it("is true for a fully valid form", () => {
    expect(
      isLoginFormValid({ email: "contact.najmulhuda@gmail.com", password: "secrete_password" })
    ).toBe(true);
  });
});
