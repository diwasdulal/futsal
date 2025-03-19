import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { loginUser } from "../api/authApi";
import { useNavigate } from "react-router-dom";
import FormInput from "../components/FormInput";

const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const response = await loginUser(data);
      localStorage.setItem("token", response.token);
      alert("Login successful");
      navigate("/booking");
    } catch (error) {
      alert(error.response.data.message || "Login failed");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="w-96 p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-center mb-4">Login</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormInput label="Email" type="email" name="email" register={register} error={errors.email} />
          <FormInput label="Password" type="password" name="password" register={register} error={errors.password} />
          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded-lg">
            Login
          </button>
        </form>
        <p className="mt-4 text-center">
          Don't have an account?{" "}
          <a href="/register" className="text-blue-500">
            Register
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
