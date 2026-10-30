import { useState } from "react";
import {Link} from "react-router-dom";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const initialValues = {
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
};

function validate(values) {
    const errors = {};
    if (!values.fullName.trim()) errors.fullName = "Enter your full name";
    if (!values.email.trim()) errors.email = "Enter your email address";
    else if (!EMAIL_PATTERN.test(values.email)) errors.email = "Enter a valid email address";
    if (!values.password) errors.password = "Enter a password";
    else if (values.password.length < 8) errors.password = "Password must be at least 8 characters";
    if (values.confirmPassword !== values.password) errors.confirmPassword = "Passwords do not match";
    return errors;
}

 function Register() {
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [formError, setFormError] = useState("");
    const [created, setCreated] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    function handleChange(e) {
        const { name, value } = e.target;
        setValues((v) => ({ ...v, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setFormError("");

        const clientErrors = validate(values);
        if (Object.keys(clientErrors).length > 0) {
            setErrors(clientErrors);
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("http://localhost:5000/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    fullName: values.fullName,
                    email: values.email,
                    password: values.password,
                }),
            });

            const data = await res.json().catch(() => ({}));

            if (res.ok) {
                setCreated(data);
                setValues(initialValues);
                setErrors({});
            } else {
                setErrors(data.errors || {});
                setFormError(data.message || "Something went wrong. Try again.");
            }
        } catch {
            setFormError("Can't reach the server. Check that the backend is running on port 8080.");
        } finally {
            setLoading(false);
        }
    }

    if (created) {
        return (
            <section className="card" role="status">
                <h1>Account created</h1>
                <p>
                    Welcome, {created.fullName}. Your account for <strong>{created.email}</strong> is ready.
                </p>
                <button type="button" className="btn" onClick={() => setCreated(null)}>
                    Register another account
                </button>
            </section>
        );
    }

    return (
        <section className="card">
            <h1>Create your account</h1>
            <p className="lead">It takes less than a minute.</p>

            {formError && (
                <div className="alert" role="alert">
                    {formError}
                </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
                <Field label="Full name" name="fullName" error={errors.fullName}>
                    <input
                        id="fullName"
                        name="fullName"
                        type="text"
                        autoComplete="name"
                        value={values.fullName}
                        onChange={handleChange}
                        aria-invalid={!!errors.fullName}
                    />
                </Field>

                <Field label="Email" name="email" error={errors.email}>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        value={values.email}
                        onChange={handleChange}
                        aria-invalid={!!errors.email}
                    />
                </Field>

                <Field label="Password" name="password" error={errors.password} hint="At least 8 characters">
                    <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        value={values.password}
                        onChange={handleChange}
                        aria-invalid={!!errors.password}
                    />
                </Field>

                <Field label="Confirm password" name="confirmPassword" error={errors.confirmPassword}>
                    <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        value={values.confirmPassword}
                        onChange={handleChange}
                        aria-invalid={!!errors.confirmPassword}
                    />
                </Field>

                <label className="check">
                    <input
                        type="checkbox"
                        checked={showPassword}
                        onChange={(e) => setShowPassword(e.target.checked)}
                    />
                    Show passwords
                </label>

                <button type="submit" className="btn" disabled={loading}>
                    {loading ? "Creating account…" : "Create account"}
                </button>
                <p><Link to="/login">Already have an account ?</Link></p>
            </form>
        </section>
    );
}

function Field({ label, name, error, hint, children }) {
    return (
        <div className={`field${error ? " has-error" : ""}`}>
            <label htmlFor={name}>{label}</label>
            {children}
            {error ? (
                <span className="msg error">{error}</span>
            ) : (
                hint && <span className="msg">{hint}</span>
            )}
        </div>
    );
}
export default Register;