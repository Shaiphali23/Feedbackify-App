import { Button, TextField, Link } from "@mui/material";
import { useForm } from "react-hook-form";
import AuthForm from "./AuthForm";
import { useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../ContextAPI/authContext";
import { styled } from "@mui/material/styles";

const SubmitButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(3),
  padding: theme.spacing(1.5),
  fontWeight: "bold",
  background: `linear-gradient(45deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: theme.shadows[4],
  },
  transition: "all 0.3s ease",
}));

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const API_BASE_URL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const { login } = useAuth();

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      let responseData;
      try {
        responseData = await response.json();
        // console.log("Response data:", responseData);
      } catch (e) {
        console.log("Failed to parse JSON response:", e);
      }

      if (!response.ok) {
        throw new Error(
          responseData?.message || `Login failed (HTTP ${response.status})`
        );
      }

      login(responseData);
      toast.success("Login successful!");
      reset();
      navigate("/dashboard");
    } catch (error) {
      console.error("Full error:", error);
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthForm title="Login">
      <>
        <ToastContainer position="top-center" autoClose={3000} />
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            size="small"
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            {...register("email", { required: "Email is required" })}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
          <TextField
            size="small"
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            {...register("password", {
              required: "Password is required",
              minLength: { value: 6, message: "Minimum 6 characters" },
            })}
            error={!!errors.password}
            helperText={errors.password?.message}
          />

          <SubmitButton
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing In..." : "Login"}
          </SubmitButton>

          <Typography sx={{ mt: 2, textAlign: "center" }}>
            Don't have an account?{" "}
            <Link href="/signup" underline="hover">
              Sign up
            </Link>
          </Typography>
        </form>
      </>
    </AuthForm>
  );
};

export default Login;
