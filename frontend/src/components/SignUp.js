import { Button, TextField, Link } from "@mui/material";
import { useForm } from "react-hook-form";
import AuthForm from "./AuthForm";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import { useState } from "react";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SignUp = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const API_BASE_URL = process.env.REACT_APP_API_URL;

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Registration failed");
      }

      // Store token and user data
      localStorage.setItem("token", responseData.token);

      toast.success("Registration successful!");
      reset(); // Reset the form fields
      //navigate("/dashboard");
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.message || "An error occurred during registration");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthForm title="Sign Up">
      <>
        <ToastContainer position="top-center" autoClose={3000} />
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            label="Name"
            fullWidth
            margin="normal"
            {...register("name", { required: "Name is required" })}
            error={!!errors.name}
            helperText={errors.name?.message}
          />
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
          <TextField
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

          <TextField
            select
            label="Role"
            fullWidth
            margin="normal"
            defaultValue=""
            {...register("role", { required: "Role is required" })}
            error={!!errors.role}
            helperText={errors.role?.message}
          >
            <MenuItem value="" disabled>
              Select your role
            </MenuItem>
            <MenuItem value="teacher">Teacher</MenuItem>
            <MenuItem value="freelancer">Freelancer</MenuItem>
            <MenuItem value="reader">Reader</MenuItem>
          </TextField>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing Up..." : "Sign Up"}
          </Button>

          <Typography sx={{ mt: 2, textAlign: "center" }}>
            Already have an account?{" "}
            <Link href="/login" underline="hover">
              Login
            </Link>
          </Typography>
        </form>
      </>
    </AuthForm>
  );
};

export default SignUp;
