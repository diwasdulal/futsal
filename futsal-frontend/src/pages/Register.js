import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { registerUser } from "../api/authApi";
import { useNavigate } from "react-router-dom";
import FormInput from "../components/FormInput";

const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup
    .string()
    .matches(/^\+?\d{10,15}$/, "Invalid phone number")
    .required("Phone is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await registerUser(data);
      alert("Registration successful! Please log in.");
      navigate("/login");
    } catch (error) {
      alert(error.response.data.message || "Registration failed");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="w-96 p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-center mb-4">Register</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormInput label="Name" type="text" name="name" register={register} error={errors.name} />
          <FormInput label="Email" type="email" name="email" register={register} error={errors.email} />
          <FormInput label="Phone" type="text" name="phone" register={register} error={errors.phone} />
          <FormInput label="Password" type="password" name="password" register={register} error={errors.password} />
          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded-lg">
            Register
          </button>
        </form>
        <p className="mt-4 text-center">
          Already have an account?{" "}
          <a href="/login" className="text-blue-500">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
